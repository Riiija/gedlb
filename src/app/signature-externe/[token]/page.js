"use client";

import { ExternalSignaturePortal } from "../../../components/softsign/ExternalSignature";

export default function SignatureExternePage({ params }) {
  return <ExternalSignaturePortal token={params.token} />;
}
