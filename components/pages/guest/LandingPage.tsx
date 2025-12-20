'use client'

import React, { useState } from 'react';
import { Menu, X, ChevronDown, Github, Linkedin, Mail, Twitter, ExternalLink, Code, Palette, Smartphone, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LandingPageGuest() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const services = [
        {
            icon: <Code className="w-8 h-8" />,
            title: "Web Development",
            description: "Building responsive and performant web applications using modern technologies and best practices."
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "UI/UX Design",
            description: "Creating beautiful and intuitive user interfaces that provide exceptional user experiences."
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "Mobile Development",
            description: "Developing native and cross-platform mobile applications for iOS and Android platforms."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Digital Solutions",
            description: "Providing comprehensive digital solutions tailored to your business needs and goals."
        }
    ];

    const portfolio = [
        {
            title: "E-Commerce Platform",
            category: "Web Development",
            image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop",
            description: "Modern online shopping experience"
        },
        {
            title: "Banking App",
            category: "Mobile App",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop",
            description: "Secure financial management"
        },
        {
            title: "Brand Identity",
            category: "Design",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
            description: "Complete branding solution"
        },
        {
            title: "Food Delivery App",
            category: "Mobile App",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop",
            description: "Seamless ordering experience"
        },
        {
            title: "SaaS Dashboard",
            category: "Web Development",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
            description: "Analytics and insights platform"
        },
        {
            title: "Travel Website",
            category: "Design",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
            description: "Inspiring wanderlust"
        }
    ];

    const scrollToSection = (section: string) => {
        setActiveSection(section);
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Logo */}
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            EasyFolio
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            {['Home', 'About', 'Resume', 'Portfolio', 'Services', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className={`text-sm font-medium transition-colors hover:text-orange-500 ${activeSection === item.toLowerCase() ? 'text-orange-500' : 'text-slate-700'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* Social Icons - Desktop */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                <Github className="w-5 h-5" />
                            </button>
                            <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden text-slate-700 hover:text-orange-500 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-200 animate-in slide-in-from-top duration-300">
                        <div className="px-4 py-4 space-y-3">
                            {['Home', 'About', 'Resume', 'Portfolio', 'Services', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="block w-full text-left px-4 py-2 text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="flex gap-4 px-4 pt-4 border-t border-slate-200">
                                <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                    <Github className="w-5 h-5" />
                                </button>
                                <button className="text-slate-600 hover:text-orange-500 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                                Crafting Digital<br />
                                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    Experiences with Passion
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
                                Transforming ideas into elegant solutions through creative design and innovative development
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                                    View My Work
                                </Button>
                                <Button variant="outline" className="h-12 px-8 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-medium transition-all duration-300">
                                    Let's Connect
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-8">
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl lg:text-4xl font-bold text-slate-900">5+</div>
                                    <div className="text-sm text-slate-600 mt-1">Years Experience</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl lg:text-4xl font-bold text-slate-900">100+</div>
                                    <div className="text-sm text-slate-600 mt-1">Projects Completed</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl lg:text-4xl font-bold text-slate-900">50+</div>
                                    <div className="text-sm text-slate-600 mt-1">Happy Clients</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent z-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                                    alt="Professional"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-slate-200 rounded-full opacity-50 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            What I Do
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Specialized services tailored to bring your digital vision to life
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {services.map((service, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-slate-50"
                            >
                                <CardContent className="p-6 lg:p-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-orange-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Featured Work
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A showcase of recent projects that demonstrate creativity and technical excellence
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {portfolio.map((project, index) => (
                            <Card
                                key={index}
                                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button className="text-white hover:text-orange-400 transition-colors">
                                            <ExternalLink className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="text-sm text-orange-600 font-medium mb-2">
                                        {project.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-slate-600">
                                        {project.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                            View All Projects
                        </Button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Let's Work Together
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Have a project in mind? Let's create something amazing together
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="h-14 px-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                            <Mail className="w-5 h-5 mr-2" />
                            Get In Touch
                        </Button>
                        <Button variant="outline" className="h-14 px-10 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-all duration-300 text-lg">
                            Download Resume
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-2xl font-bold">EasyFolio</div>
                        <div className="flex gap-6">
                            <button className="hover:text-orange-400 transition-colors">
                                <Twitter className="w-6 h-6" />
                            </button>
                            <button className="hover:text-orange-400 transition-colors">
                                <Github className="w-6 h-6" />
                            </button>
                            <button className="hover:text-orange-400 transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </button>
                            <button className="hover:text-orange-400 transition-colors">
                                <Mail className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-8 pt-8 border-t border-slate-800 text-slate-400">
                        <p>© 2025 EasyFolio by Alisa. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slide-in-from-top 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}