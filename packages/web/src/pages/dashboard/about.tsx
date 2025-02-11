import { Image } from '@heroui/image'
import { title } from '@/components/primitives'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { FaGithub } from 'react-icons/fa'
import { IoDocumentText } from 'react-icons/io5'
import { BsTencentQq } from 'react-icons/bs'

export default function AboutPage () {
  return (
    <section className="flex flex-col items-center justify-center pt-20 md:pt-8">
      <Image src="/web/karin.png" className="w-32" alt="logo" />
      <h1
        className={title({
          color: 'pink',
          size: 'md',
        })}
      >
        KarinJS
      </h1>
      <div className="flex gap-2 mt-8 mb-10">
        <Button
          as={Link}
          href="https://karin.fun/"
          isExternal
          showAnchorIcon
          variant="bordered"
          radius="full"
          startContent={<IoDocumentText className="text-lg" />}
        >
          使用文档
        </Button>
        <Button
          as={Link}
          href="https://github.com/KarinJS/Karin"
          isExternal
          showAnchorIcon
          variant="bordered"
          radius="full"
          color="primary"
          startContent={<FaGithub className="text-lg" />}
        >
          Github
        </Button>
        <Button
          as={Link}
          href="https://qm.qq.com/q/7CnIb6CFnG"
          isExternal
          showAnchorIcon
          variant="bordered"
          radius="full"
          color="warning"
          startContent={<BsTencentQq className="text-lg" />}
        >
          QQ群
        </Button>
      </div>
      <Image
        src="https://camo.githubusercontent.com/5efbe35937c6deb17301f659fa2876b0b680f2b1adbf0b94e40af74ce82758e3/68747470733a2f2f636f6e7472696275746f72732d696d672e7765622e6170702f696d6167653f7265706f3d4b6172696e4a532f4b6172696e"
        className="max-w-full mb-4"
        alt="contributors"
        radius="none"
      />
      <Image
        src="https://camo.githubusercontent.com/2211a63e6ea3ef6a370bbdb02107a8f21878dc054032aba28d539b4775e6c70b/68747470733a2f2f7265706f62656174732e6178696f6d2e636f2f6170692f656d6265642f616161613237353963383838353639313434336134643830653537353366393735643466323530652e737667"
        className="max-w-full"
        alt="contributors"
        radius="none"
      />
    </section>
  )
}
