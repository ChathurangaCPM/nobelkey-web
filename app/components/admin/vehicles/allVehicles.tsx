"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../common/dataTable";

type Vehicles = {
  _id: string;
  id: string;
  name: string;
  image: string;
  amountPerKm: number;
}


type AllVehiclesProps = {
  initialData?: Vehicles[],
}

const AllVehicles: React.FC<AllVehiclesProps> = ({
  initialData
}) => {
  const [data, setData] = useState<Vehicles[]>(initialData || []);
  const router = useRouter();

  const columns: ColumnDef<Vehicles>[] = [
    {
      accessorKey: "vehicleName",
      header: "Vehicle Name",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center gap-2">{row.getValue("vehicleName")}</div>
        )
      },
    },
    {
      accessorKey: "initialCharge",
      header: "Initial Charge",
      cell: ({ row }) => <div className="lowercase">{row.getValue("initialCharge")}</div>,
    },
    {
      accessorKey: "maxPassenger",
      header: "Max Passenger",
      cell: ({ row }) => <div className="lowercase">{row.getValue("maxPassenger")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        return <div className="font-medium uppercase">{moment(row.getValue("createdAt")).format('YYYY-MM-DD hh:mm a')}</div>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/vehicles/${data?._id}`)}
              >
                Edit Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  useEffect(() => {
    setData(initialData || [])
  }, [initialData])

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Vehicles</h2>
          <Button onClick={() => router.push('/admin/vehicles/new')}>Create new vehicle</Button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          onRowClick={(d) => router.push(`/admin/vehicles/${d?._id}`)}
          loading={false}
        />
      </div>
    </div>
  )
}

export default AllVehicles;