"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiGithub, FiMoon, FiSun } from "react-icons/fi"
import { BiLogoMongodb, BiLogoFirebase } from "react-icons/bi"
import { RiNextjsFill } from "react-icons/ri"
import { FaNodeJs, FaReact, FaLinkedinIn, FaFacebook, FaTwitter, FaWhatsapp, FaWordpress } from "react-icons/fa"
import { SiExpress, SiJavascript, SiTailwindcss } from "react-icons/si"
import { MdEmail } from "react-icons/md"
import Link from "next/link"
import Image from "next/image"
import profile_pic from "@/public/shahriar.jpg"
import { ProjectCard } from "@/components/ProjectCard"
import restaurant_shot from "@/public/restaurant_shot.jpg"
import api_shot from "@/public/api_shot.jpg"
import naya_canvas_shot from "@/public/naya_canvas_shot.jpg"
import sleek_lifestyle_shot from "@/public/sleek_lifestyle_shot.jpg"
import blood_link_shot from "@/public/blood_linkk_shot.jpg"
import reactangle_image from "@/public/rectangle.png"
import { ContactForm } from "@/components/ContactForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  const [typeText, setTypeText] = useState("Freelancer")

  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const texts = ["Freelancer", "React Developer", "Next.js Expert", "SEO Specialist"]
    // const texts = ["Freelancer", "React Developer"]
    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setTypeText(texts[index])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log(document.documentElement.classList)
    if (typeof (window) == 'undefined') {
      return
    }
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <div className={`min-h-screen`}>
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Navbar */}
          {/* <Navbar /> */}
          {/* Hero Section */}
          <section className=" md:px-5 lg:px-24 py-8 sm:py-20 bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
              <div className="md:w-1/2 mb-10 md:h-[400px]">
                <div className="text-gray-800 dark:text-white sm:w-[430px]">
                  <h2 className="text-sm sm:text-3xl drop-shadow-md tracking-wide">Shahriar Sany</h2>
                  <div className="leading-[60px] overflow-hidden ml-10">
                    <span className="text-2xl">is a </span>
                    <span className=" sm:text-4xl pl-2 relative after:content-[''] after:absolute after:top-0 after:left-0 after:h-[102%] after:w-[102%] after:border-l-2 dark:after:bg-gray-800 dark:after:border-white after:border-gray-900 after:bg-gray-200 after:animate-[typewriter_4s_steps(15)_infinite]">
                      {typeText}
                    </span>
                  </div>
                </div>
                <p className="text-base sm:text-xl mb-8">
                  Crafting responsive and innovative web solutions where technology meets creativity
                </p>
                <p className="text-lg mb-8 italic">"Transforming ideas into seamless digital experiences"</p>
                <Link
                  href="#contact"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Let's Collaborate
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={profile_pic || "/placeholder.svg"}
                  alt="Shahriar Sany"
                  className="rounded-full shadow-lg w-60 h-60 object-cover border-4 border-blue-500 dark:border-blue-400"
                />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className=" py-8 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="skills">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
                Technical Expertise
              </h2>
              <p className="text-center mb-8 max-w-2xl mx-auto">
                Leveraging cutting-edge technologies to build robust, scalable, and efficient web applications
              </p>

              <div className=" flex justify-evenly items-center sm:p-4">
                <Image
                  src={reactangle_image || "/placeholder.svg"}
                  alt="image"
                  className=" hidden md:block object-cover object-center  "
                // height={300}
                />

                {/* <motion.div
                  initial={{ x: '100%' }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-8 justify-items-center">
                  <SkillIcon Icon={FaReact} name="React" color="text-blue-500" />
                  <SkillIcon Icon={RiNextjsFill} name="Next.js" color="text-black dark:text-white" />
                  <SkillIcon Icon={SiExpress} name="Express" color="text-gray-700 dark:text-gray-300" />
                  <SkillIcon Icon={BiLogoMongodb} name="MongoDB" color="text-green-500" />
                  <SkillIcon Icon={BiLogoFirebase} name="Firebase" color="text-yellow-500" />
                  <SkillIcon Icon={SiJavascript} name="JavaScript" color="text-yellow-400" />
                  <SkillIcon Icon={FaNodeJs} name="Node.js" color="text-green-600" />
                  <SkillIcon Icon={SiTailwindcss} name="Tailwind" color="text-teal-500" />
                  <SkillIcon Icon={IoLogoCss3} name="CSS" color="text-blue-600" />
                  <SkillIcon Icon={FaHtml5} name="HTML5" color="text-orange-500" />
                </motion.div> */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.2 }} // Controls delay between rows
                  // viewport={{ once: true }}
                  className=" p-2 h-full sm:w-auto w-full grid md:gap-8 justify-items-center"
                >
                  {[
                    [
                      { Icon: FaReact, name: "React", color: "text-blue-500" },
                      { Icon: RiNextjsFill, name: "Next.js", color: "text-black dark:text-white" },
                      { Icon: FaWordpress, name: "Wordpress", color: "text-blue-600" },
                    ],
                    [
                      { Icon: SiExpress, name: "Express", color: "text-gray-700 dark:text-gray-300" },
                      { Icon: BiLogoFirebase, name: "Firebase", color: "text-yellow-500" },
                      { Icon: SiJavascript, name: "JavaScript", color: "text-yellow-400" },
                    ],
                    [
                      { Icon: FaNodeJs, name: "Node.js", color: "text-green-600" },
                      { Icon: SiTailwindcss, name: "Tailwind", color: "text-teal-500" },
                      { Icon: BiLogoMongodb, name: "MongoDB", color: "text-green-500" },
                    ],
                  ].map((row, rowIndex) => (
                    <motion.div
                      key={rowIndex}
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { delay: rowIndex * 0.4 } },
                      }}
                      className="flex justify-evenly w-full sm:gap-16"
                    >
                      {row.map(({ Icon, name, color }, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 },
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <SkillIcon Icon={Icon} name={name} color={color} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="sm:py-20 py-5 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" id="projects">
            <div className="container mx-auto px-4">
              <h2 className=" text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-10 text-blue-600 dark:text-blue-400">
                Featured Projects
              </h2>
              <p className="text-center mb-4 sm:mb-12 max-w-2xl mx-auto">
                Explore a collection of my recent work, showcasing innovative solutions and creative designs
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ProjectCard
                  title="Sunnah Restaurant"
                  description="A dynamic food ordering platform with an intuitive user interface and seamless ordering process."
                  link="https://sunnah-restaurant.netlify.app/"
                  image={restaurant_shot}
                />
                <ProjectCard
                  title="Sleek Lifestyle"
                  description="A full-stack e-commerce solution with advanced product management and secure user authentication."
                  link="https://sleek-lifestyle.com/"
                  image={sleek_lifestyle_shot}
                />
                <ProjectCard
                  title="Naya Canvas"
                  description="An immersive art gallery platform showcasing diverse artworks with a responsive and elegant design."
                  link="https://naya-canvas.netlify.app/"
                  image={naya_canvas_shot}
                  hoverDuration="6s"
                />
                <ProjectCard
                  title="Prayer Time Api"
                  description="It was the first time something I coded actually got used by other people, I still remember the first email I got and it really made my day :')"
                  link="https://abdulrahman.id/projects/daily-prayer-time"
                  image={api_shot}
                  hoverDuration="6s"
                />
                <ProjectCard
                  title="Blood Link"
                  description="A non-profit organization which facilitate both blood donors and receivers."
                  link="https://blood-linkk.vercel.app/"
                  image={blood_link_shot}
                  hoverDuration="1.8s"
                />
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-8 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="contact">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-10 text-blue-600 dark:text-blue-400">
                Get In Touch
              </h2>
              <p className="text-center mb-4 sm:mb-8 max-w-2xl mx-auto">
                Have a project in mind? Fill out the form below and I'll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </section>

          {/* About Section */}
          <section className=" py-8 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="about">
            <div className="container mx-auto px-4">
              <h2 className=" text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-10 text-blue-600 dark:text-blue-400">
                About Me
              </h2>
              <div className="max-w-3xl mx-auto text-center">
                <p className=" text-sm sm:text-xl mb-2 sm:mb-8">
                  As a passionate Full Stack Developer, I thrive on turning complex problems into elegant, efficient
                  solutions. My journey in web development has equipped me with a comprehensive skill set in the MERN
                  Stack, Next.js, and Firebase, allowing me to craft end-to-end web applications that not only meet but
                  exceed client expectations.
                </p>
                <p className=" text-sm sm:text-xl mb-2 sm:mb-8">
                  I believe in the power of continuous learning and staying ahead of the curve in the ever-evolving tech
                  landscape. This drive keeps me excited about each new project and the unique challenges it brings.
                </p>
                <h3 className="text-2xl font-bold mb-4">Core Competencies</h3>
                <ul className="text-left list-disc list-inside mb-8">
                  <li>Full-Stack Web Development</li>
                  <li>Responsive and Mobile-First Design</li>
                  <li>RESTful API Development</li>
                  <li>Database Design and Optimization</li>
                  <li>Performance Tuning and SEO</li>
                  <li>Agile Methodologies and Version Control</li>
                </ul>
                <p className="text-lg italic">
                  "The best way to predict the future is to create it." - I live by this mantra, constantly pushing the
                  boundaries of what's possible in web development.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className=" pb-8 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300" >
            <div className="container mx-auto text-center px-4">
              <h2 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">
                Let's Create Something Amazing
              </h2>
              <p className="text-xl mb-8">
                Ready to bring your ideas to life? I'm here to help turn your vision into reality.
              </p>
              <Link
                href="mailto:nahid.web.creator@gmail.com"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300"
              >
                <MdEmail className="mr-2" /> Start a Conversation
              </Link>
              <div className="mt-12 flex justify-center space-x-6">
                <SocialIcon Icon={FaLinkedinIn} link="#" />
                <SocialIcon Icon={FiGithub} link="https://github.com/Sany45/" />
                <SocialIcon Icon={FaFacebook} link="https://www.facebook.com/profile.php?id=61574553182596" />
                <SocialIcon Icon={FaTwitter} link="https://x.com/shahriarsanyii?t=fS5X_8IbmAMJqpXGwITIfg&s=09" />
                <SocialIcon Icon={FaWhatsapp} link="https://wa.me/8801998256197" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>
    </div>
  )
}

function SkillIcon({ Icon, name, color }: { Icon: React.ElementType; name: string; color: string }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      // whileInView={{ y: 0 }}
      whileHover={{ y: 10 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center group"
    >
      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-300">
        <Icon className={`text-4xl ${color}`} />
      </div>
      <span className="mt-2 text-sm font-medium">{name}</span>
    </motion.div>
  )
}

function SocialIcon({ Icon, link }: { Icon: React.ElementType; link: string }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 rounded-full p-1 h-10 w-10 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
    >
      <Icon className="h-full w-full pointer-events-none" />
    </Link>
  )
}
