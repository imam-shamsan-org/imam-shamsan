import { useState } from 'react'
import { ZellePaymentSheet } from '@/components/shared/ZellePaymentSheet'

interface ContributeDialogProps {
  trigger: React.ReactNode
  projectTitle: string
  caseTitle?: string
  personName?: string
}

export function ContributeDialog({
  trigger,
  projectTitle,
  caseTitle,
  personName,
}: ContributeDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents">
        {trigger}
      </span>

      <ZellePaymentSheet
        open={open}
        onClose={() => setOpen(false)}
        personName={personName}
        mode="contribution"
        projectTitle={projectTitle}
        caseTitle={caseTitle}
      />
    </>
  )
}
