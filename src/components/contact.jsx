import { useState } from "react"
import Reveal from "./reveal"
import emailjs from "@emailjs/browser"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState("idle") // idle, sending, success, error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")

    try {
      // Replace with your EmailJS credentials
      await emailjs.send(
        "service_ecwex65", // Get from EmailJS dashboard
        "template_otfuenn", // Get from EmailJS dashboard
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "RHsH6QtIq6dXMYYq6" // Get from EmailJS dashboard
      )

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })

      // Reset success message after 5s
      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      console.error("EmailJS error:", error)
      setStatus("error")

      // Reset error message after 5s
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section
      id="contact"
      className="
        px-8
        lg:px-16

        pt-25
        lg:pt-35

        pb-20

        border-t
        border-white/[0.07]
      "
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2

            gap-16
            lg:gap-25
          "
        >
          <Reveal>
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-3.5

                  mb-10

                  font-mono
                  uppercase
                  tracking-[0.32em]
                  text-[10px]

                  text-white/35
                "
              >
                <span className="w-7 h-px bg-white/35" />
                Let's Talk
              </div>

              <h2
                className="
                  font-serif
                  text-[clamp(36px,4.5vw,64px)]
                  leading-[1.08]
                "
              >
                Have a project
                <br />
                in mind?
                <em className="block italic text-white/60">
                  Let's build it.
                </em>
              </h2>

              {/* Contact Links */}
              <div className="mt-16">
                {[
                  {
                    label: "Email",
                    value: "affavanleon@gmail.com",
                    href: "mailto:affavanleon@gmail.com",
                  },
                  {
                    label: "Github",
                    value: "github.com/leonx24",
                    href: "https://github.com/leonx24",
                  },
                  {
                    label: "Discord",
                    value: "leonx24",
                    href: "https://discord.com",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      flex
                      justify-between
                      items-center

                      py-6

                      border-b
                      border-white/[0.07]
                    "
                  >
                    <div>
                      <div
                        className="
                          mb-1.5

                          font-mono
                          uppercase
                          tracking-[0.28em]
                          text-[9px]

                          text-white/35
                        "
                      >
                        {item.label}
                      </div>

                      <div
                        className="
                          font-serif
                          text-[18px]
                          text-white/70
                          group-hover:text-white
                          transition-colors
                          duration-300
                        "
                      >
                        {item.value}
                      </div>
                    </div>

                    <span
                      className="
                        text-white/35

                        transition-all
                        duration-500
                        ease-out

                        group-hover:text-white
                        group-hover:translate-x-1.5
                        group-hover:-translate-y-1.5
                      "
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <form onSubmit={handleSubmit} className="lg:pt-16">
              {/* Name Input */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="
                    block
                    mb-2.5

                    font-mono
                    uppercase
                    tracking-[0.28em]
                    text-[9px]

                    text-white/35
                  "
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    px-4
                    py-3.5

                    bg-white/[0.01]

                    border
                    border-white/[0.07]

                    text-white
                    font-mono
                    text-[12px]
                    tracking-wide

                    transition-all
                    duration-300

                    focus:outline-none
                    focus:border-white/30
                    focus:bg-white/[0.03]

                    hover:border-white/20
                  "
                  placeholder="Your name"
                />
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="
                    block
                    mb-2.5

                    font-mono
                    uppercase
                    tracking-[0.28em]
                    text-[9px]

                    text-white/35
                  "
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    px-4
                    py-3.5

                    bg-white/[0.01]

                    border
                    border-white/[0.07]

                    text-white
                    font-mono
                    text-[12px]
                    tracking-wide

                    transition-all
                    duration-300

                    focus:outline-none
                    focus:border-white/30
                    focus:bg-white/[0.03]

                    hover:border-white/20
                  "
                  placeholder="your@email.com"
                />
              </div>

              {/* Message Input */}
              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="
                    block
                    mb-2.5

                    font-mono
                    uppercase
                    tracking-[0.28em]
                    text-[9px]

                    text-white/35
                  "
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="
                    w-full
                    px-4
                    py-3.5

                    bg-white/[0.01]

                    border
                    border-white/[0.07]

                    text-white
                    font-mono
                    text-[12px]
                    tracking-wide

                    transition-all
                    duration-300

                    focus:outline-none
                    focus:border-white/30
                    focus:bg-white/[0.03]

                    hover:border-white/20
                    resize-none
                  "
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="
                  w-full
                  px-9
                  py-4

                  border
                  border-white/13

                  font-mono
                  uppercase
                  tracking-[0.22em]
                  text-[11px]

                  text-white/60

                  transition-all
                  duration-300

                  hover:bg-white
                  hover:text-black
                  hover:border-white

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "success"
                  ? "Message Sent ✓"
                  : status === "error"
                  ? "Error - Try Again"
                  : "Send Message"}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <p
                  className="
                    mt-4
                    text-center
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-green-400/80
                  "
                >
                  Thanks! I'll get back to you soon.
                </p>
              )}

              {status === "error" && (
                <p
                  className="
                    mt-4
                    text-center
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-red-400/80
                  "
                >
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}