import { memo, useState, useMemo, use } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@apollo/client/react'
import { GetUsersDocument, type GetUsersQuery, GetPostsDocument, type GetPostsQuery } from '../../__generated__/graphql'

import { TableFilters } from './TableFilters'
import PostsCell from './cells/PostsCell'
import GenericCell from './cells/GenericCell'
import LoadingSpinner from '../LoadingSpinner'

const columnHelper = createColumnHelper<GetUsersQuery['users'][0]>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <GenericCell className="font-mono text-xs text-gray-500" value={info.getValue()} />,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => <GenericCell className="text-sm text-gray-900" value={info.getValue()} />,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: info => <GenericCell className="text-sm tabular-nums" value={info.getValue()} />,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => <GenericCell className="text-sm" value={info.getValue()} />,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: info => <GenericCell className="text-sm" value={info.getValue()} />,
  }),
]

const TableContent = memo(({ search } : { search: string }) => {
  const userFilters = useMemo(() => {
    const s = search?.trim()
    return s ? { name: { contains: s } } : {};
  }, [search])

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GetUsersDocument, {
    variables: {
      filters: userFilters,
    },
  })

  const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GetPostsDocument, {
    variables: { filters: {} },
  })
  
  const data: GetUsersQuery['users'] = usersData?.users ?? []
  const posts: GetPostsQuery['posts'] = postsData?.posts ?? []

  const postsByUser: Record<string, GetPostsQuery['posts']> = {}
  for (const post of posts) {
    const key = post.userId;
    if (!key) continue;
    ;(postsByUser[key] ||= []).push(post)
  }

  const extendedColumns = [
    ...columns,
    columnHelper.display({
      id: 'posts',
      header: 'Posts',
      cell: info => {
        const userId = info.row.original.id;
        const userPosts = postsByUser[userId] || [];
        return <PostsCell posts={userPosts} />
      },
    }),
  ]
  
  const table = useReactTable({
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  if (usersLoading || postsLoading) return <div className="p-4"><LoadingSpinner label='Loading users and posts...'/></div>
  if (usersError || postsError) return <div className="p-4 text-red-500">Error: {usersError?.message || postsError?.message}</div>

  return (
    <table className="min-w-full table-auto border-collapse rounded-md bg-white">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="[&>tr:nth-child(even)]:bg-gray-50">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t border-gray-200">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 align-top text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
    </table>
  )
})

export const Table = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="p-2">
      <TableFilters searchValue={searchValue} setSearchValue={setSearchValue} />
      <TableContent search={searchValue} />
    </div>
  )
}
