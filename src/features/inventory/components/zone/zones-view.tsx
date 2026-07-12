
import { HateoasLink } from "@/types"
import { ZoneTable } from "./zone-table"
import { Link } from "react-router"
import { routes } from "@khinemyaezin/seller-contracts"
import { Button } from "@khinemyaezin/seller-ui/components/index"
import { ButtonGroup } from "@khinemyaezin/seller-ui/components/button-group"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@khinemyaezin/seller-ui/components/card"

export type ZonesViewProps = {
    locationId: string,
    link: HateoasLink // Zone list link,
    canCreate: boolean
}

export default function ZonesView({ locationId, link, canCreate }: ZonesViewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>List of zones</CardTitle>
                <CardAction>
                    <ButtonGroup>
                        {canCreate && (
                            <Button type="button">
                                <Link to="new">Add Zone</Link>
                            </Button>
                        )}
                    </ButtonGroup>
                </CardAction>
            </CardHeader>
            <CardContent>
                {link && (
                    <ZoneTable locationId={locationId} link={link}
                    ></ZoneTable>
                )}
            </CardContent>
        </Card>
    )
}
