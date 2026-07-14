
import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types"
import { ZoneTable } from "./zone-table"
import { Link } from "react-router"
import { Button, Separator } from "@khinemyaezin/seller-ui/components/index"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@khinemyaezin/seller-ui/components/card"
import { Plus } from "lucide-react"
import ZoneFilter from "./zone-filter"
import { useZoneFilter } from "@/features/inventory/hooks/use-zone-filter"

export type ZonesViewProps = {
    locationId: string,
    link: HateoasLink
    canCreate: boolean,
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
}

export default function ZonesView({ locationId, link, canCreate, onLifecycleEvent }: ZonesViewProps) {
    const { filter, updateCriteria, updatePage } = useZoneFilter({ locationId });

    return (
        <Card className="gap-3">
            <CardHeader>
                <CardTitle>Zones</CardTitle>
                <CardDescription>
                    Organize fulfillment areas and the bins inside each zone.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-6 pt-3">
                    <div className="w-full sm:flex-1">
                        <ZoneFilter onChange={updateCriteria} />
                    </div>
                    {canCreate && (
                        <Button type="button" variant="outline" className="self-start sm:self-end" asChild>
                            <Link to="new">
                                Add Zone
                            </Link>
                        </Button>
                    )}
                </div>
                {link && (
                    <ZoneTable
                        locationId={locationId}
                        link={link}
                        filter={filter}
                        onPageChange={updatePage}
                        onLifecycleEvent={onLifecycleEvent}
                    />

                )}
            </CardContent>
        </Card>
    )
}
