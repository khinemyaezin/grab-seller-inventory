
import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types"
import { ZoneTable } from "./zone-table"
import { Link } from "react-router"
import { Button } from "@khinemyaezin/seller-ui/components/index"
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardDescription } from "@khinemyaezin/seller-ui/components/card"
import { PlusIcon } from "lucide-react"

export type ZonesViewProps = {
    locationId: string,
    link: HateoasLink
    canCreate: boolean,
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
}

export default function ZonesView({ locationId, link, canCreate, onLifecycleEvent }: ZonesViewProps) {
    return (
        <Card className="gap-0">
            <CardHeader>
                <CardTitle>Zones</CardTitle>
                <CardDescription>
                    Organize fulfillment areas and the bins inside each zone.
                </CardDescription>
                {canCreate && (
                    <CardAction>
                        <Button variant="outline" type="button" asChild>
                            <Link to="new">
                                Add Zone
                            </Link>
                        </Button>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="px-0 pt-3">
                {link && (
                    <ZoneTable locationId={locationId} link={link} onLifecycleEvent={onLifecycleEvent}
                    ></ZoneTable>
                )}
            </CardContent>
        </Card>
    )
}
