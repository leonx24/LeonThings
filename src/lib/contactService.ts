import emailjs from "@emailjs/browser"

export interface SocialLinkItem {
  label: string
  value: string
  href: string
}

export interface ContactTopicPreset {
  label: string
  text: string
}

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    label: "Email",
    value: "affavanleon@gmail.com",
    href: "mailto:affavanleon@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/leonx24",
    href: "https://github.com/leonx24",
  },
  {
    label: "Discord",
    value: "leonx24",
    href: "https://discord.com",
  },
]

export const CONTACT_TOPICS: ContactTopicPreset[] = [
  {
    label: "Commission",
    text: "Hi Leon, I'm interested in commissioning you for a Roblox/Luau scripting project. Here are the details: ",
  },
  {
    label: "Discord Bot",
    text: "Hi Leon, I'm looking to build/host a Discord automation bot with custom web hooks. Here is my concept: ",
  },
  {
    label: "Web Dev",
    text: "Hi Leon, I'd like to collaborate on a frontend React/Vite development project. Here is what we are building: ",
  },
  {
    label: "Say Hi",
    text: "Hi Leon, just explored your HARBOR portfolio and wanted to reach out!",
  },
]

export async function sendContactMessage(
  payload: ContactPayload
): Promise<void> {
  const serviceId =
    import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ecwex65"
  const templateId =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_otfuenn"
  const publicKey =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "RHsH6QtIq6dXMYYq6"

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: payload.name,
      from_email: payload.email,
      message: payload.message,
    },
    publicKey
  )
}
