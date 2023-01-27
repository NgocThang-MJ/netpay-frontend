import * as React from "react";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import { getRecords } from "_api/record";
import { Record, Attribute } from "types/record";

const columnHelper = createColumnHelper<Record>();

const renderTag = (price: string) => {
  return <div className="text-center">{price}</div>;
};

export default function RecordTable() {
  const [records, setRecords] = useState<Record[]>([]);
  const { status, data } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });

  const sumOfMust = data?.reduce((accumulator, currentValue) => {
    if (currentValue.attribute === Attribute.MustHave) {
      return accumulator + parseInt(currentValue.price);
    }
    return accumulator;
  }, 0);

  const sumOfNice = data?.reduce((accumulator, currentValue) => {
    if (currentValue.attribute === Attribute.NiceToHave) {
      return accumulator + parseInt(currentValue.price);
    }
    return accumulator;
  }, 0);

  const sumOfWasted = data?.reduce((accumulator, currentValue) => {
    if (currentValue.attribute === Attribute.Wasted) {
      return accumulator + parseInt(currentValue.price);
    }
    return accumulator;
  }, 0);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      footer: "Sum",
    }),
    columnHelper.accessor("attribute", {
      header: () => "Must Have",
      cell: (info) =>
        info.getValue() === Attribute.MustHave
          ? renderTag(info.row.original.price)
          : "",
      footer: () => <div className="text-emerald-400">{sumOfMust}</div>,
    }),
    columnHelper.accessor("attribute", {
      header: () => "Nice To Have",
      cell: (info) =>
        info.getValue() === Attribute.NiceToHave
          ? renderTag(info.row.original.price)
          : "",
      footer: () => <div className="text-amber-300">{sumOfNice}</div>,
    }),
    columnHelper.accessor("attribute", {
      header: () => "Wasted",
      cell: (info) =>
        info.getValue() === Attribute.Wasted
          ? renderTag(info.row.original.price)
          : "",
      footer: () => <div className="text-red-400">{sumOfWasted}</div>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) =>
        new Date(info.getValue() || Date.now()).toLocaleDateString("vi-VN"),
    }),
  ];

  useEffect(() => {
    if (!data) return setRecords([]);
    setRecords(data);
  }, [data]);

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>An error occured</span>;
  }

  return (
    <div>
      {records && records.length > 0 ? (
        <table className="mx-auto mt-3 text-slate-300">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={crypto.randomUUID()}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={crypto.randomUUID()}
                    className="border-b border-slate-500 px-6 pb-2 first:text-left last:text-right"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={crypto.randomUUID()} className="odd:bg-slate-700">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={crypto.randomUUID()}
                    className="border-black px-6 py-1"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={crypto.randomUUID()}>
                {footerGroup.headers.map((header) => (
                  <th
                    key={crypto.randomUUID()}
                    className="first:text-left px-6 py-1 border-t border-slate-500 mt-3"
                  >
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
      ) : (
        <div>Empty data</div>
      )}
    </div>
  );
}
