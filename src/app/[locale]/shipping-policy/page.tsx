import { Metadata } from "next";
import { BRAND_NAME } from "@/config";
import PolicyLayout from "@/components/ui/PolicyLayout";
import { Heading, Text } from "@/components/ui/primitives";

export const metadata: Metadata = {
	title: `Shipping Policy | ${BRAND_NAME}`,
};

export default function PrivacyPolicy() {
	return (
		<PolicyLayout title="Shipping Policy">
			<Heading level={2} size="xl" weight="bold">
				In-Stock
			</Heading>
			<Text size="lg">
				We aim to have all orders shipped the next day if placed before 12AM Central Time.
			</Text>
			<Heading level={2} size="xl" weight="bold">
				Pre-Orders
			</Heading>
			<Text size="lg">
				With pre-orders, we will have all shipped the next day when we receive them. All of our shipments will ship via USPS, which usually takes about 3-4 days depending on your location. You will receive a shipment notification email with tracking once your order has shipped.
			</Text>
		</PolicyLayout>
	);
}
