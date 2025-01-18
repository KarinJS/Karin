import { Form as HeroUIForm } from '@heroui/form'
import type { FormProps as HeroUIFormProps } from '@heroui/form'

export interface FormProps extends HeroUIFormProps {
  errors?: Record<
    string,
    {
      message?: string
    }
  >
}

export function Form(props: FormProps) {
  const { errors, validationErrors, ...rest } = props
  const errorTips = errors
    ? Object.keys(errors).reduce(
        (
          acc: {
            [key: string]: string
          },
          key,
        ) => {
          acc[key] = errors[key].message || ''
          return acc
        },
        {},
      )
    : {}
  const errs = validationErrors ?? errorTips
  return <HeroUIForm {...rest} validationErrors={errs} validationBehavior="aria" />
}
