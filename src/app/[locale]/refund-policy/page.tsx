import { Metadata } from "next";
import { BRAND_EMAIL, BRAND_NAME } from "@/config";
import PolicyLayout from "@/components/ui/PolicyLayout";
import { Text, LinkButton } from "@/components/ui/primitives";

export const metadata: Metadata = {
	title: `Refund Policy | ${BRAND_NAME}`,
};

export default function RefundPolicy() {
	return (
		<PolicyLayout title="Refund Policy">
			<Text size="lg">
				Unfortunately, we do not accept any kind of return/refund/exchange at the moment, sorry for the inconvenience. We are still working on to make it possible.
			</Text>
			<Text size="lg">
				Send us an email with any concerns at {BRAND_EMAIL}.
			</Text>
			<LinkButton href={`mailto:${BRAND_EMAIL}`} variant="outline" size="sm" className="w-fit">
				Email Support
			</LinkButton>
		</PolicyLayout>
	);
}
