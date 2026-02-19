import Image from "next/image";
import { Flex } from "@/components/ui/primitives";

export default function Logo() {
  return (
    <Flex alignItems="center" className="font-bold text-white drop-shadow-lg text-xl">
      <Image className="w-[50px] h-[50px]" src={'/images/logo.webp'} alt="Logo" width={50} height={50} />
    </Flex>
  )
}
