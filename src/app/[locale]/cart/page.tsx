"use client";

import { useCart } from "@/contexts/cart-context";
import PreorderForm from "@/components/preorder/PreorderForm";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/types/types";
import { useIntlayer, useLocale } from "next-intlayer";
import { Box, Card, Heading, Text, Button, Stack, Container, Flex } from "@/components/ui/primitives";
import Loader from "@/components/ui/Loader";
import { calculateCartSubtotal } from "@/lib/logic";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";

export default function CartPage() {
  const { cart, removeFromCart, isLoading } = useCart();
  const t = useIntlayer("cart");
  const localeData = useLocale();
  const locale = normalizeLocale(localeData);

  const subtotal = calculateCartSubtotal(cart);

  if (isLoading && cart.length === 0) {
    return (
      <Box className="min-h-screen bg-[#0a2735] pt-32 p-10 flex items-center justify-center">
        <Loader />
      </Box>
    );
  }

  if (cart.length === 0) {
    return (
      <Box className="min-h-screen bg-[#0a2735] pt-32 p-10 flex flex-col items-center justify-center text-center">
        <Stack gap={6} alignItems="center">
          <ShoppingBag className="w-20 h-20 text-slate-700" />
          <Stack gap={2}>
            <Heading level={1} size="3xl" color="text-white">{t.emptyTitle.value}</Heading>
            <Text color="text-slate-400">{t.emptySubtitle.value}</Text>
          </Stack>
          <Link href={buildLocalePath(locale, "/")}>
            <Button variant="primary" size="lg">
              {t.goShopping.value}
            </Button>
          </Link>
        </Stack>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-[#0a2735] pt-32 pb-20 px-4">
      <Container maxWidth="6xl">
        <Flex gap={4} className="mb-10" alignItems="center">
          <Link href={buildLocalePath(locale, "/")}>
             <Button variant="secondary" size="sm" className="p-2 rounded-full min-w-0">
                <ArrowLeft className="w-6 h-6" />
             </Button>
          </Link>
          <Heading level={1} size="4xl" color="text-white">{t.title.value}</Heading>
        </Flex>
        
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Box className="lg:col-span-2 space-y-4">
            <Stack gap={4}>
              {cart.map((item: CartItem, index: number) => (
                <Card key={`${item.item_id}-${item.size}-${item.color}-${index}`} className="p-4 flex gap-4 items-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-xl object-cover bg-white/5" />
                  ) : (
                    <Box className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center">
                       <ShoppingBag className="w-8 h-8 text-slate-700" />
                    </Box>
                  )}
                  <Box className="flex-1">
                    <Text weight="bold" color="text-white" size="lg" className="block mb-1">{item.title}</Text>
                    <Text size="sm" color="text-slate-400" className="block mb-2">
                      {item.color} {item.size ? `| ${t.size.value}: ${item.size}` : ""}
                    </Text>
                    <Flex gap={4} alignItems="center">
                       <Text weight="black" color="text-[#58a076]">฿{item.price.toLocaleString()}</Text>
                       <Text size="xs" weight="bold" color="text-slate-500">{t.qty.value}: {item.quantity}</Text>
                    </Flex>
                  </Box>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(index)}
                    className="text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                    title={t.remove.value}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </Card>
              ))}
            </Stack>
            
            <Card variant="glass" className="p-6 mt-8">
               <Flex justifyContent="between" alignItems="center" className="mb-1">
                  <Text size="xl" weight="bold" color="text-white">{t.subtotal.value}</Text>
                  <Text size="2xl" weight="black" color="text-[#58a076]">฿{subtotal.toLocaleString()}</Text>
               </Flex>
               <Text size="sm" color="text-slate-400">{t.shippingNotice.value}</Text>
            </Card>
          </Box>

          <Box className="lg:col-span-1">
             <Card className="p-6 sticky top-32">
                <PreorderForm />
             </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}