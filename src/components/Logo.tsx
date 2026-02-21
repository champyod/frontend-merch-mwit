import Image from "next/image";
import { Flex } from "@/components/ui/primitives";

export default function Logo() {
  return (
    <Flex alignItems="center" className="font-bold text-white drop-shadow-lg text-xl">
      <Image className="w-10 h-10 rounded-lg shadow-sm" src={'/logo.png'} alt="Logo" width={40} height={40} />
    </Flex>
  )
}
