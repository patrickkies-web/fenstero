# Anfrage an Black Forest Labs: Auftragsverarbeitung (DPA)

Für „An meinem Haus ansehen“ (docs/GESTALTUNG.md, functions/api/hausbild.js). Senden über den Support von Black Forest Labs
(dashboard.bfl.ai, Help Center) oder an die dort genannte Adresse für Datenschutz. Die Antworten gehören in die Datenschutzerklärung,
Abschnitt 5a (Platzhalter „[bitte ergänzen: …]“).

---

**Subject:** Data Processing Agreement (GDPR Art. 28) for FLUX API usage, account [E-Mail Ihres Kontos bei Black Forest Labs]

Hello,

we use the FLUX API (FLUX 3 Image Klein, EU endpoint api.eu.bfl.ai) in our web app eeziframes.com in Germany. Our users can upload a
photo of their house; we send a cropped part of that photo together with images of the windows they plan, and FLUX returns an image
with the new windows built in. The photos may contain personal data (e.g. a recognisable house or address). We act as controller,
you would act as our processor under Art. 28 GDPR.

Could you please send us:

1. Your Data Processing Agreement (DPA) for API customers, or the way to accept it for our account.
2. The legal entity and address that is our contracting party and processor.
3. Where input images and generated images are processed and stored when we use the EU endpoint, and whether any sub-processors
   outside the EU/EEA (e.g. in the USA) are involved. If so, which transfer mechanism applies (EU Standard Contractual Clauses, EU-US
   Data Privacy Framework).
4. How long you keep the input images and the generated images, and when they are deleted.
5. Whether input or output images are used to train or improve your models, and how we can opt out for our account.
6. Your list of sub-processors and your technical and organisational measures (Art. 32 GDPR).
7. Whether we may use the generated images commercially (shown to our users, used in our advertising).
8. Whether input images, prompts and outputs are reviewed by humans (e.g. for moderation), and whether a zero-retention option exists.
9. Whether, with the EU endpoint, computing, storage, moderation, delivery (delivery.*.bfl.ai) and support access stay entirely within
   the EU/EEA.
10. Whether your terms forbid removing provenance information (C2PA, watermarks) from outputs. We composite the result into the
    user's photo and add our own visible and XMP label "AI visualisation".
11. Whether we must bind our end users to your usage policy, and whether you give any warranty or indemnity regarding the outputs.
12. Your technical and organisational measures (e.g. ISO 27001 or SOC 2) and how quickly you notify us of a personal data breach.

Thank you and kind regards
Patrick Kies, eeziframes

---

## Zweite E-Mail: Training abbestellen

Laut Datenschutzerklärung von Black Forest Labs (bfl.ai/legal/privacy-policy) widerspricht man dem Training per E-Mail an
**privacy@blackforestlabs.ai** mit dem Betreff **„Training Opt Out“** und den Kontodaten. Bitte vor dem Freischalten senden und die
Bestätigung aufheben; ihr Datum gehört in `HB_EINW_TEXT.ohneTraining` (web/assets/hausbild.js).

**To:** privacy@blackforestlabs.ai
**Subject:** Training Opt Out

Hello,

please exclude all inputs and outputs of our API account from training and improving your models, with effect for all
future requests:

- Account e-mail: [E-Mail Ihres Kontos bei Black Forest Labs]
- Organisation: eeziframes ([Firma und Anschrift laut Impressum von eeziframes.com])
- Usage: FLUX API, EU endpoint api.eu.bfl.ai

Our requests contain photos of our users' houses, which may be personal data. Please confirm the opt-out in writing, and tell us
from which date it applies and whether it also covers images that are already stored.

Thank you and kind regards
Patrick Kies, eeziframes
