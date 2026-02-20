"use client"

import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose} from "../ui/dialog"
import NosologyMethodology from "../Methodology/NosologyMethodology"

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { to: "/", label: "Главная", color: "text-blue-500" },
    { to: "/analytics", label: "Аналитика", color: "text-green-500" },
  ]

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md border-b-2 border-[#c1d3ff]"
          : "bg-white border-b border-[#e8e8e8]"
      }`}
    >
      <div className="flex h-14 sm:h-14 w-full justify-between items-center px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="min-w-0 text-left">
            <h1 className="text-sm sm:text-base font-bold text-[#1b1b1b] truncate">
              Карта нозологий и смертности
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                Методология
              </button>
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isActive(item.to)
                      ? "bg-[#236FFF] text-white"
                      : "bg-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className={`rounded-lg p-2 transition-all duration-200 border ${
                mobileMenu
                  ? "bg-[#ebf1ff] text-[#3772ff] border-[#c1d3ff]"
                  : "text-[#283353] hover:bg-[#ebf1ff] border-transparent hover:border-[#c1d3ff]"
              }`}
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenu && (
        <div className="lg:hidden border-t border-[#e8e8e8] bg-white animate-in slide-in-from-top-2 duration-300">
          <div className="py-3 px-4 space-y-2 flex flex-col">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenu(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive(item.to)
                      ? "bg-gradient-to-r from-[#3772ff] to-[#2956bf] text-white shadow-md"
                      : "text-[#283353] hover:bg-[#ebf1ff] border border-transparent hover:border-[#c1d3ff]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                setIsMethodologyOpen(true);
                setMobileMenu(false);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#283353] hover:bg-[#ebf1ff] border border-transparent hover:border-[#c1d3ff] transition-colors w-full text-left"
            >
              <span>`Методология</span>
            </button>
          </div>
        </div>
      )}
    </header>

    <Dialog open={isMethodologyOpen} onOpenChange={setIsMethodologyOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto text-left">
        <DialogHeader className="sticky top-0 bg-white shadow-sm z-50">
          <DialogTitle className="text-2xl">
            Карта нозологий и смертности
          </DialogTitle>
          <DialogClose onOpenChange={setIsMethodologyOpen} />
        </DialogHeader>
        <div className="mt-4"><NosologyMethodology/></div>
      </DialogContent>
    </Dialog>
    </>
  )
}
