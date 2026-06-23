import { useEffect, useMemo, useState } from "react";
import {
  addFeatures,
  queryFeatures,
  updateFeatures,
} from "@esri/arcgis-rest-feature-service";
import union from "@turf/union";
import { Card, Flex, Grid, Spinner, Text } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useGroupAccess from "../hooks/useGroupAccess";
import {
  EDITOR_FIELDS,
  fmtDate,
  fmtDateTime,
  geojsonToZoningGeometry,
  LIST_OUT_FIELDS,
  PARCEL_ID_FIELD,
  PARCEL_LAYER_URL,
  PARCELS_FIELD_MAX,
  parseParcels,
  SORT_OPTIONS,
  sortKey,
  ZONING_FIELDS,
  ZONING_GROUP_ID,
  ZONING_LAYER_URL,
} from "../data/zoning";
import AmendmentCardList from "./AmendmentCardList";
import AmendmentView from "./AmendmentView";

const sqlList = (ids) =>
  ids.map((id) => `'${String(id).replace(/'/g, "''")}'`).join(",");

const blankAttributes = () =>
  Object.fromEntries(ZONING_FIELDS.map((f) => [f.name, ""]));

const LIST_PAGE_SIZE = 2000;

const Zoning = () => {
  const { token } = useAuth();
  const { hasAccess, checking } = useGroupAccess(ZONING_GROUP_ID);

  // list state
  const [records, setRecords] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [sortField, setSortField] = useState("file_number");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedId, setSelectedId] = useState(null); // OBJECTID shown in detail

  // full detail record + geometry for the selected amendment (view mode)
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailGeometry, setDetailGeometry] = useState(null);
  const [detailParcelAddresses, setDetailParcelAddresses] = useState({});
  const [detailError, setDetailError] = useState(null);

  // edit state
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState("new"); // "new" | "edit"
  const [objectId, setObjectId] = useState(null);
  const [attributes, setAttributes] = useState(blankAttributes);
  const [selectedIds, setSelectedIds] = useState([]);
  const [parcelGeoms, setParcelGeoms] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { ok, message }

  // load the amendment list
  useEffect(() => {
    if (!hasAccess) return;
    let cancelled = false;
    setLoadingList(true);

    const loadAllRecords = async () => {
      const all = [];
      let resultOffset = 0;

      while (!cancelled) {
        const res = await queryFeatures({
          url: ZONING_LAYER_URL,
          where: "1=1",
          outFields: LIST_OUT_FIELDS,
          returnGeometry: false,
          orderByFields: "OBJECTID",
          resultOffset,
          resultRecordCount: LIST_PAGE_SIZE,
          authentication: token,
        });
        const features = res?.features || [];
        all.push(...features.map((f) => f.attributes));

        if (!res?.exceededTransferLimit || features.length === 0) break;
        resultOffset += features.length;
      }

      if (!cancelled) {
        setRecords(all);
        setLoadingList(false);
      }
    };

    loadAllRecords().catch(() => {
      if (cancelled) return;
      setRecords([]);
      setLoadingList(false);
    });

    return () => {
      cancelled = true;
    };
  }, [hasAccess, token, refreshSignal]);

  // load full attributes + geometry for the selected record
  useEffect(() => {
    if (!hasAccess || selectedId == null) {
      setDetailRecord(null);
      setDetailGeometry(null);
      setDetailError(null);
      return;
    }
    let cancelled = false;
    setDetailRecord(null);
    setDetailGeometry(null);
    setDetailParcelAddresses({});
    setDetailError(null);
    queryFeatures({
      url: ZONING_LAYER_URL,
      where: `OBJECTID = ${selectedId}`,
      outFields: ["*"],
      returnGeometry: true,
      f: "geojson",
      authentication: token,
    })
      .then((res) => {
        if (cancelled) return;
        const feat = res?.features?.[0] || null;
        setDetailRecord(feat?.properties || null);
        setDetailGeometry(feat || null);
        if (!feat) setDetailError("Could not find that amendment.");
      })
      .catch(() => {
        if (cancelled) return;
        setDetailRecord(null);
        setDetailGeometry(null);
        setDetailError("Unable to load amendment details.");
      });
    return () => {
      cancelled = true;
    };
  }, [hasAccess, selectedId, token, refreshSignal]);

  // addresses for the viewed record's affected parcels (view mode)
  useEffect(() => {
    if (editing || !detailRecord) {
      setDetailParcelAddresses({});
      return;
    }
    const ids = parseParcels(detailRecord.parcels);
    if (ids.length === 0) {
      setDetailParcelAddresses({});
      return;
    }
    let cancelled = false;
    queryFeatures({
      url: PARCEL_LAYER_URL,
      where: `${PARCEL_ID_FIELD} IN (${sqlList(ids)})`,
      outFields: [PARCEL_ID_FIELD, "address"],
      returnGeometry: false,
      authentication: token,
    })
      .then((res) => {
        if (cancelled) return;
        const map = {};
        (res?.features || []).forEach((f) => {
          const pid = f.attributes?.[PARCEL_ID_FIELD];
          if (pid != null && f.attributes.address) map[pid] = f.attributes.address;
        });
        setDetailParcelAddresses(map);
      })
      .catch(() => {
        if (cancelled) return;
        setDetailParcelAddresses({});
      });
    return () => {
      cancelled = true;
    };
  }, [editing, detailRecord, token]);

  const sortedRecords = useMemo(() => {
    const opt = SORT_OPTIONS.find((o) => o.value === sortField);
    const kind = opt?.kind || "string";
    return [...records].sort((a, b) => {
      const av = sortKey(a[sortField], kind);
      const bv = sortKey(b[sortField], kind);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [records, sortField, sortDir]);

  // dissolved boundary for the edit-mode preview (WGS84)
  const dissolved = useMemo(() => {
    const feats = selectedIds.map((id) => parcelGeoms[id]).filter(Boolean);
    if (feats.length === 0) return null;
    if (feats.length === 1) return feats[0];
    try {
      return union({ type: "FeatureCollection", features: feats });
    } catch (e) {
      return null;
    }
  }, [selectedIds, parcelGeoms]);

  // parcel_id -> address, from the fetched parcel features
  const parcelAddresses = useMemo(() => {
    const map = {};
    Object.entries(parcelGeoms).forEach(([id, feat]) => {
      const addr = feat?.properties?.address;
      if (addr) map[id] = addr;
    });
    return map;
  }, [parcelGeoms]);

  const fetchParcelGeom = (parcelId) =>
    queryFeatures({
      url: PARCEL_LAYER_URL,
      where: `${PARCEL_ID_FIELD} = '${String(parcelId).replace(/'/g, "''")}'`,
      outFields: [PARCEL_ID_FIELD, "address"],
      returnGeometry: true,
      f: "geojson",
      authentication: token,
    }).then((res) => res?.features?.[0] || null);

  const addParcelId = (parcelId) => {
    setSelectedIds((ids) => (ids.includes(parcelId) ? ids : [...ids, parcelId]));
    fetchParcelGeom(parcelId)
      .then((feature) => {
        if (feature) {
          setParcelGeoms((g) => ({ ...g, [parcelId]: feature }));
          return;
        }
        setSelectedIds((ids) => ids.filter((id) => id !== parcelId));
        setParcelGeoms((g) => {
          const next = { ...g };
          delete next[parcelId];
          return next;
        });
        setStatus({ ok: false, message: `Parcel ${parcelId} was not found.` });
      })
      .catch(() => {
        setSelectedIds((ids) => ids.filter((id) => id !== parcelId));
        setParcelGeoms((g) => {
          const next = { ...g };
          delete next[parcelId];
          return next;
        });
        setStatus({ ok: false, message: `Unable to load parcel ${parcelId}.` });
      });
  };

  const handleToggleParcel = (parcelId) => {
    setStatus(null);
    if (selectedIds.includes(parcelId)) {
      setSelectedIds((ids) => ids.filter((id) => id !== parcelId));
      return;
    }
    addParcelId(parcelId);
  };

  const handleAddParcel = (parcelId) => {
    setStatus(null);
    if (selectedIds.includes(parcelId)) return;
    addParcelId(parcelId);
  };

  const handleRemoveParcel = (parcelId) =>
    setSelectedIds((ids) => ids.filter((id) => id !== parcelId));

  const handleClearParcels = () => {
    setSelectedIds([]);
    setParcelGeoms({});
  };

  const handleAttrChange = (name, value) =>
    setAttributes((a) => ({ ...a, [name]: value }));

  // auto-dismiss success messages
  useEffect(() => {
    if (status?.ok) {
      const t = setTimeout(() => setStatus(null), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  // ---- navigation ----
  const handleSelectCard = (rec) => {
    setSelectedId(rec.OBJECTID);
    setEditing(false);
    setStatus(null);
  };

  const handleNew = () => {
    setMode("new");
    setObjectId(null);
    setSelectedId(null);
    setAttributes(blankAttributes());
    setSelectedIds([]);
    setParcelGeoms({});
    setStatus(null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (selectedId == null || !detailRecord || detailRecord.OBJECTID !== selectedId) {
      return;
    }
    setStatus(null);
    setMode("edit");
    setObjectId(selectedId);
    setEditing(true);

    // seed the form from the full detail record
    const attrs = detailRecord || {};
    const next = blankAttributes();
    ZONING_FIELDS.forEach((f) => {
      const raw = attrs[f.name];
      next[f.name] = f.type === "date" ? fmtDate(raw) : raw ?? "";
    });
    setAttributes(next);

    // rehydrate parcels from the `parcels` string
    const ids = (attrs.parcels || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    setSelectedIds(ids);
    setParcelGeoms({});
    if (ids.length > 0) {
      queryFeatures({
        url: PARCEL_LAYER_URL,
        where: `${PARCEL_ID_FIELD} IN (${sqlList(ids)})`,
        outFields: [PARCEL_ID_FIELD, "address"],
        returnGeometry: true,
        f: "geojson",
        authentication: token,
      })
        .then((res) => {
          const map = {};
          (res?.features || []).forEach((feat) => {
            const pid = feat.properties?.[PARCEL_ID_FIELD];
            if (pid != null) map[pid] = feat;
          });
          setParcelGeoms(map);
        })
        .catch(() => {
          setParcelGeoms({});
          setStatus({
            ok: false,
            message: "Unable to load parcel geometry for this amendment.",
          });
        });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setStatus(null);
  };

  const parcelsString = selectedIds.join("|");
  const overLimit = parcelsString.length > PARCELS_FIELD_MAX;
  const canSave = selectedIds.length > 0 && !!dissolved && !overLimit && !saving;

  const handleSave = () => {
    if (!canSave) return;
    setSaving(true);
    setStatus(null);

    const outAttrs = {};
    ZONING_FIELDS.forEach((f) => {
      const v = attributes[f.name];
      outAttrs[f.name] = v === "" || v == null ? null : v;
    });
    outAttrs.parcels = parcelsString;

    const geometry = geojsonToZoningGeometry(dissolved.geometry);
    const feature =
      mode === "edit"
        ? { attributes: { OBJECTID: objectId, ...outAttrs }, geometry }
        : { attributes: outAttrs, geometry };
    const op = mode === "edit" ? updateFeatures : addFeatures;

    op({ url: ZONING_LAYER_URL, features: [feature], authentication: token })
      .then((res) => {
        const result = (res?.addResults || res?.updateResults || [])[0];
        if (result?.success) {
          const newId = result.objectId ?? objectId;
          const wasNew = mode === "new";
          setObjectId(newId);
          setSelectedId(newId);
          setMode("edit");
          setStatus({
            ok: true,
            message: wasNew ? "Amendment created." : "Changes saved.",
          });
          setRefreshSignal((n) => n + 1);
        } else {
          setStatus({
            ok: false,
            message: result?.error?.description || "Save failed.",
          });
        }
        setSaving(false);
      })
      .catch((err) => {
        setStatus({ ok: false, message: err?.message || "Save failed." });
        setSaving(false);
      });
  };

  // ---- access gating ----
  if (checking) {
    return (
      <Flex align="center" justify="center" gap="2" className="p-8">
        <Spinner /> <Text>Checking access…</Text>
      </Flex>
    );
  }

  if (!hasAccess) {
    return (
      <Flex direction="column" align="center" justify="center" className="p-8" gap="2">
        <Card className="bg-red-100 border-red-300 max-w-md">
          <Flex align="center" gap="2" className="mb-1">
            <ExclamationTriangleIcon className="text-red-600" />
            <Text weight="medium" className="text-red-700">
              No access
            </Text>
          </Flex>
          <Text size="2" className="text-red-600">
            This tool is restricted to City Planning Commission staff. Please{" "}
            <Link to="/login?app=zoning" className="underline">
              sign in
            </Link>{" "}
            with an account in the CPC zoning group.
          </Text>
        </Card>
      </Flex>
    );
  }

  // values + provenance for the unified view
  const viewValues = editing ? attributes : detailRecord;
  const editedBy = !editing ? detailRecord?.[EDITOR_FIELDS.editor] : null;
  const editedOn = !editing ? fmtDateTime(detailRecord?.[EDITOR_FIELDS.edited]) : null;

  return (
    <Grid
      columns={{ initial: "1fr", sm: "1fr 2fr" }}
      gap={{ initial: "2", sm: "4" }}
      p={{ initial: "2", sm: "2", lg: "4" }}
    >
      <AmendmentCardList
        records={sortedRecords}
        loading={loadingList}
        selectedId={selectedId}
        sortField={sortField}
        sortDir={sortDir}
        onSortField={setSortField}
        onToggleDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        onSelect={handleSelectCard}
        onNew={handleNew}
      />

      <Flex direction="column" className="min-w-0">
        {editing || selectedId != null ? (
          detailError && !editing ? (
            <Card className="bg-red-100 border-red-300">
              <Flex align="center" gap="2">
                <ExclamationTriangleIcon className="text-red-600" />
                <Text size="2" className="text-red-700">
                  {detailError}
                </Text>
              </Flex>
            </Card>
          ) : (
            <AmendmentView
              editing={editing}
              mode={mode}
              values={viewValues}
              onAttrChange={handleAttrChange}
              geometry={detailGeometry}
              selectedIds={selectedIds}
              parcelAddresses={editing ? parcelAddresses : detailParcelAddresses}
              dissolved={dissolved}
              onToggleParcel={handleToggleParcel}
              onAddParcel={handleAddParcel}
              onRemoveParcel={handleRemoveParcel}
              onClearParcels={handleClearParcels}
              saving={saving}
              canSave={canSave}
              status={status}
              onSave={handleSave}
              onDismissStatus={() => setStatus(null)}
              onEdit={handleEdit}
              onCancel={handleCancel}
              editedBy={editedBy}
              editedOn={editedOn}
            />
          )
        ) : (
          <Flex align="center" justify="center" className="h-full p-8">
            <Text size="3" color="gray">
              Select an amendment from the list, or create a new one.
            </Text>
          </Flex>
        )}
      </Flex>
    </Grid>
  );
};

export default Zoning;
