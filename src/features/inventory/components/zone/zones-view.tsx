
import { HateoasLink, ZoneLifecycleEvent, BinLifecycleEvent } from "@/types"
import { ZoneTable } from "./zone-table"
import { Link } from "react-router"
import { Button } from "@khinemyaezin/seller-ui/components/index"
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@khinemyaezin/seller-ui/components/card"

export type ZonesViewProps = {
    locationId: string,
    link: HateoasLink // Zone list link,
    canCreate: boolean,
    onLifecycleEvent?: (event: ZoneLifecycleEvent | BinLifecycleEvent) => void;
}

export default function ZonesView({ locationId, link, canCreate, onLifecycleEvent }: ZonesViewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>List of zones</CardTitle>
                <CardAction>
                    <ButtonGroup>
                        {canCreate && (
                            <Button variant="outline" type="button" asChild>
                                <Link to="new">Add Zone</Link>
                            </Button>
                        )}
                    </ButtonGroup>
                </CardAction>
            </CardHeader>
            <CardContent>
                {link && (
                    <ZoneTable locationId={locationId} link={link} onLifecycleEvent={onLifecycleEvent}
                    ></ZoneTable>
                )}
            </CardContent>
        </Card>
    )
}
