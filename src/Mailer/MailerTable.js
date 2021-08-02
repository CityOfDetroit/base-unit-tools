import { useMemo } from "react"
import { usePagination, useTable } from 'react-table'

const MailerTable = ({ filtered }) => {

  let cols = [
    { accessor: 'FNL_PRIADR', Header: 'Address' },
    { accessor: 'FNL_SECADR', Header: 'Unit' },
    { accessor: 'DPV_VACANT', Header: 'Is Deliverable?' }
  ]

  let columns = useMemo(() => cols, [filtered])

  let data = useMemo(() => filtered.map(f => f.attributes), [filtered])

  console.log(columns)
  console.log(data)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 15 }
  },
  usePagination
  )


  return (
    <>
      <table {...getTableProps()} className="w-full">
        <thead >
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} >
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className='bg-gray-300 m-0 py-2 pl-2'>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} className="pl-2 border border-bottom-1">{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="p-2">
        <button className="p-1 bg-gray-100 border border-black w-12" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button className="p-1 bg-gray-100 border border-black w-12" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button className="p-1 bg-gray-100 border border-black w-12" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button className="p-1 bg-gray-100 border border-black w-12" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
      </div>
    </>
  )
}

export default MailerTable