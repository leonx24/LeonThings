import { useState } from "react";

import { personalInfo } from "../../Data/project";
import useScrollAnimation from "../ui/useScrollAnimation";

const ContactSection = () => {
  const ref = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("sending");

    setTimeout(() => {
      setStatus("success");

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setTimeout(() => {
        setStatus(null);
      }, 4000);
    }, 1500);
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="
        animate-on-scroll
        relative
        overflow-hidden
        py-32
      "
    >
      {/* AMBIENT LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-500px
          w-500px
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/5
          blur-[140px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
        "
      >

        {/* GLASS CARD */}
        <div
          className="
            overflow-hidden
            rounded-[40px]
            border
            border-white/10
            bg-white/3
            p-10
            backdrop-blur-2xl
            md:p-16
          "
        >

          <div
            className="
              grid
              gap-20
              lg:grid-cols-2
            "
          >

            {/* LEFT */}
            <div>

              <p
                className="
                  mb-5
                  text-sm
                  uppercase
                  tracking-[0.2em]
                  text-cyan-400
                "
              >
                Contact
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  leading-tight
                  text-white
                  md:text-5xl
                "
              >
                Let’s create something meaningful together.
              </h2>

              <p
                className="
                  mt-8
                  text-lg
                  leading-8
                  text-zinc-400
                "
              >
                Have a project, collaboration, or idea in
                mind? Feel free to reach out — I’m always
                open to discussing new opportunities.
              </p>

              {/* CONTACT INFO */}
              <div
                className="
                  mt-12
                  space-y-5
                "
              >

                {[
                  {
                    label: "Email",
                    value: personalInfo.email,
                    href: `mailto:${personalInfo.email}`,
                  },

                  {
                    label: "Github",
                    value:
                      "github.com/" +
                      personalInfo.github?.split("/").pop(),

                    href: personalInfo.github,
                  },

                  {
                    label: "LinkedIn",
                    value:
                      "linkedin.com/in/" +
                      personalInfo.linkedin?.split("/").pop(),

                    href: personalInfo.linkedin,
                  },
                ].map(
                  (item) =>
                    item.href && (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/3
                          p-5
                          transition-all
                          duration-500
                          hover:border-cyan-400/20
                          hover:bg-white/5
                        "
                      >
                        <div>

                          <p
                            className="
                              text-xs
                              uppercase
                              tracking-[0.15em]
                              text-zinc-500
                            "
                          >
                            {item.label}
                          </p>

                          <p
                            className="
                              mt-2
                              text-white
                            "
                          >
                            {item.value}
                          </p>

                        </div>

                        <span
                          className="
                            text-zinc-600
                            transition-all
                            duration-500
                            group-hover:text-cyan-400
                            group-hover:translate-x-1
                          "
                        >
                          →
                        </span>
                      </a>
                    )
                )}

              </div>

            </div>

            {/* RIGHT */}
            <form
              onSubmit={handleSubmit}
              className="
                flex
                flex-col
                gap-6
              "
            >

              {/* INPUT */}
              {[
                {
                  label: "Name",
                  name: "name",
                  type: "text",
                  placeholder: "Your name",
                },

                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "your@email.com",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex flex-col gap-3"
                >
                  <label
                    className="
                      text-sm
                      text-zinc-400
                    "
                  >
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/3
                      px-5
                      py-4
                      text-white
                      placeholder:text-zinc-600
                      outline-none
                      transition-all
                      duration-500
                      focus:border-cyan-400/20
                      focus:bg-white/5
                    "
                  />
                </div>
              ))}

              {/* TEXTAREA */}
              <div className="flex flex-col gap-3">

                <label
                  className="
                    text-sm
                    text-zinc-400
                  "
                >
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell me about your project..."
                  className="
                    resize-none
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/3
                    px-5
                    py-4
                    text-white
                    placeholder:text-zinc-600
                    outline-none
                    transition-all
                    duration-500
                    focus:border-cyan-400/20
                    focus:bg-white/5
                  "
                />

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="
                  mt-4
                  rounded-full
                  bg-white
                  px-7
                  py-4
                  text-sm
                  font-medium
                  text-black
                  transition-all
                  duration-500
                  hover:bg-zinc-200
                "
              >
                {status === "sending"
                  ? "Sending..."
                  : "Send Message"}
              </button>

              {/* STATUS */}
              {status === "success" && (
                <p className="text-sm text-green-400">
                  ✓ Message sent successfully.
                </p>
              )}

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;