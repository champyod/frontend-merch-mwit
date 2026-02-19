"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { Preorder } from "@/types/types";
import { Card, Box, Stack, Flex, Text, Heading, Badge } from "@/components/ui/primitives";
import OrderStatusStepper from "@/components/ui/OrderStatusStepper";

interface OrderCardProps {
  order: Preorder;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const { orderIdLabel, totalAmountLabel, currency } = useIntlayer("orders-list");

  return (
    <Link href={`/orders/${order.id}`} passHref>
      <Card variant="glass" className="p-6 hover:bg-white/[0.08] transition-all group">
        <Flex className="flex-col md:flex-row" justifyContent="between" gap={6} alignItems="center">
          <Stack gap={4} className="flex-1 w-full">
            <Flex gap={3} alignItems="center">
              <Badge variant="success">
                {orderIdLabel}{order.id}
              </Badge>
              <Flex gap={1.5} className="text-white/40 text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(order.created_at).toLocaleDateString()}
              </Flex>
            </Flex>
            
            <Flex gap={2} wrap="wrap">
              {order.items.map((item, idx) => (
                <Box key={idx} className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold text-white/70">
                  {item.item.title} x{item.quantity}
                </Box>
              ))}
            </Flex>

            <OrderStatusStepper currentStatus={order.status} />
          </Stack>

          <Flex className="flex-row md:flex-col w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5" justifyContent="between" alignItems="end" gap={4}>
            <div className="text-right">
              <Text size="xs" weight="bold" color="text-white/40" uppercase tracking="widest" className="mb-1 block">
                {totalAmountLabel}
              </Text>
              <Text size="2xl" weight="black" color="text-white">
                {currency}{order.total_price.toLocaleString()}
              </Text>
            </div>
            <Box className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#58a076] group-hover:bg-[#58a076]/10 transition-all">
              <ChevronRight className="w-6 h-6" />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
};
