import React, {useEffect} from "react";

import { useRouter } from "next/router";


const ParcelViewer = () => {

  let router = useRouter();

  // redirect to /map and pass parameters
  useEffect(() => {
    if(router && !router.isReady) return;
    else {
      if (router.query.id && router.query.type) {
        router.push({
          pathname: "/map",
          query: {
            layers: "parcels",
            id: router.query.id,
            type: router.query.type
          }
        });    }
      else {
        router.push({
          pathname: "/map",
          query: {
            layers: "parcels"
          }
        });
      }
    }
  }, [router.isReady]); 
  
  return (
    <>
    </>
  )
}

export default ParcelViewer;

