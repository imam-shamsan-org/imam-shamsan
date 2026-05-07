import { InquirySheet } from './InquirySheet'
import type { Service } from '@/types/service'
import { ZellePaymentSheet } from '@/components/shared/ZellePaymentSheet'

interface ServiceDetailDialogProps {
  service: Service
  open: boolean
  onClose: () => void
  personName?: string
}

export function ServiceDetailDialog({
  service,
  open,
  onClose,
  personName,
}: ServiceDetailDialogProps) {
  if (service.inquiryOnly) {
    return (
      <InquirySheet
        open={open}
        onClose={onClose}
        personName={personName}
        serviceName={service.nameEn}
        serviceNameAr={service.nameAr}
        inquiryDescription={service.inquiryDescription}
      />
    )
  }

  return (
    <ZellePaymentSheet
      open={open}
      onClose={onClose}
      personName={personName}
      mode="service"
      serviceName={service.nameEn}
      serviceNameAr={service.nameAr}
      priceDisplay={service.priceDisplay}
      priceNote={service.priceNote}
    />
  )
}
