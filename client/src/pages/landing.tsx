import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Sparkles, Brain, Smartphone, Zap, Palette, History, Download, ArrowRight, Check, Play } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/signup");
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const features = [
    {
      icon: Brain,
      title: "Smart AI Personalization",
      description: "Our AI learns your niche, style preferences, and content type to generate perfectly tailored images for your brand."
    },
    {
      icon: Smartphone,
      title: "Multi-Platform Ready",
      description: "Generate images optimized for Instagram, LinkedIn, Twitter, and more with perfect dimensions and aspect ratios."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get professional-quality images in seconds, not hours. Our optimized AI pipeline delivers results in 10-30 seconds."
    },
    {
      icon: Palette,
      title: "Professional Design",
      description: "Every image follows design best practices with proper typography, color harmony, and visual hierarchy."
    },
    {
      icon: History,
      title: "Generation History",
      description: "Keep track of all your creations, organize favorites, and easily access previous generations for reuse."
    },
    {
      icon: Download,
      title: "High-Quality Downloads",
      description: "Download images in multiple formats and resolutions, perfect for any platform or use case."
    }
  ];

  const examples = [
    {
      category: "Fitness",
      platform: "Instagram",
      title: "Transformation Tuesday",
      description: "Motivational before/after style post with inspiring typography overlay",
      color: "bg-green-100 text-green-800"
    },
    {
      category: "Business",
      platform: "LinkedIn",
      title: "Market Insights",
      description: "Professional data visualization perfect for LinkedIn business posts",
      color: "bg-blue-100 text-blue-800"
    },
    {
      category: "Food",
      platform: "Instagram",
      title: "Recipe Spotlight",
      description: "Appetizing ingredient layout with elegant recipe presentation",
      color: "bg-orange-100 text-orange-800"
    },
    {
      category: "Tech",
      platform: "Twitter",
      title: "Product Launch",
      description: "Sleek tech announcement with modern visual elements",
      color: "bg-purple-100 text-purple-800"
    },
    {
      category: "Fashion",
      platform: "Instagram",
      title: "Style Guide",
      description: "Elegant fashion showcase with sophisticated typography",
      color: "bg-pink-100 text-pink-800"
    },
    {
      category: "Travel",
      platform: "Instagram",
      title: "Wanderlust",
      description: "Inspiring travel destination with adventure-themed design",
      color: "bg-teal-100 text-teal-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-3 slide-in-left">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg pulse-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-gradient-primary">AI Creator Studio</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 slide-in-up">
              <a href="#features" className="text-slate-600 hover:text-primary transition-all duration-300 font-medium hover:scale-105">Features</a>
              <a href="#examples" className="text-slate-600 hover:text-primary transition-all duration-300 font-medium hover:scale-105">Examples</a>
              <a href="#pricing" className="text-slate-600 hover:text-primary transition-all duration-300 font-medium hover:scale-105">Pricing</a>
            </div>

            {/* Mobile Navigation - visible on mobile */}
            <div className="md:hidden flex items-center space-x-3">
              <Button variant="ghost" onClick={handleLogin} className="text-sm px-3 py-2 hover:bg-white/50 backdrop-blur-sm">
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="btn-primary text-sm px-4 py-2 shadow-md hover:shadow-lg">
                Start
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-4 slide-in-right">
              <Button variant="ghost" onClick={handleLogin} className="hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="btn-primary shadow-lg hover:shadow-primary/25">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with modern elements */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-bounce-gentle"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary/40 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-400/40 rounded-full animate-bounce-gentle" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 animate-fade-in">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 glass-card mb-8 mx-auto lg:mx-0 hover-lift">
                  <span className="relative flex h-2 w-2 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-slate-700">✨ New: Advanced AI Image Generation</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight mb-8 mx-auto lg:mx-0 max-w-4xl lg:max-w-none">
                  Create Stunning{" "}
                  <span className="text-gradient-primary relative animate-gradient">
                    AI-Generated
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-full animate-shimmer"></div>
                  </span>{" "}
                  Social Media Posts
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                  Generate professional social media images tailored to your niche with our intelligent AI. 
                  Perfect for Instagram, LinkedIn, and Twitter posts that engage and convert.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center sm:items-start">
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted} 
                    className="btn-primary text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-2xl shadow-strong hover:shadow-glow-primary transform hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                  >
                    <Sparkles className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="glass-button text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-2xl border-2 border-white/30 hover:border-primary/30 transition-all duration-300 w-full sm:w-auto group"
                  >
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">5 free generations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <Check className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">10 second generation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 mt-16 lg:mt-0 slide-in-right">
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  {examples.slice(0, 4).map((example, index) => (
                    <Card 
                      key={index} 
                      className={`card-hover rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-medium ${
                        index % 2 === 0 ? 'rotate-2' : '-rotate-2'
                      } hover:rotate-0 stagger-item`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="relative overflow-hidden">
                        <div className="w-full h-40 bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                          <Sparkles className="w-12 h-12 text-slate-400 relative z-10" />
                          <div className="absolute top-2 right-2">
                            <div className={`w-3 h-3 rounded-full ${example.color.split(' ')[0]} opacity-80`}></div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">{example.category}</span>
                            <span className="text-xs text-slate-400">{example.platform}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">{example.title}</div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-intense float">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  AI Generated
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-10 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-10 right-10 w-16 h-16 bg-blue-200/30 rounded-full blur-sm animate-pulse" style={{animationDelay: '3s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20 fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Brain className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 mx-auto max-w-5xl leading-tight">
              Everything you need to create{" "}
              <span className="text-gradient-primary">amazing content</span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Our AI understands your niche, style, and audience to generate perfectly tailored social media images
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group text-center p-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-medium hover:shadow-intense hover:scale-105 transition-all duration-500 stagger-item relative overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-0 relative z-10">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section id="examples" className="py-24 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-yellow-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20 fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-soft mb-6">
              <Palette className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-slate-700">Gallery Showcase</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 mx-auto max-w-5xl leading-tight">
              See what our AI can create for{" "}
              <span className="text-gradient-secondary">your niche</span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Real examples generated by our AI for different industries and styles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {examples.map((example, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-medium hover:shadow-intense hover:scale-105 transition-all duration-500 stagger-item"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-56 bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Sparkles className="w-16 h-16 text-slate-400 relative z-10 group-hover:text-primary transition-colors duration-300" />
                    
                    {/* Category indicator */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-4 h-4 rounded-full ${example.color.split(' ')[0]} shadow-lg`}></div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${example.color} backdrop-blur-sm`}>
                        {example.category}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">{example.platform}</span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      {example.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {example.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center slide-in-up mt-12 sm:mt-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="btn-primary text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-intense hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-md sm:max-w-none"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Start Creating Your Images
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M20 20l20-20v40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20 fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Simple Pricing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 mx-auto max-w-5xl leading-tight">
              Start creating for{" "}
              <span className="text-gradient-primary">free</span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Try our AI image generation with 5 free credits. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-medium hover:shadow-intense hover:scale-105 transition-all duration-500 stagger-item">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">
                  $0<span className="text-lg text-slate-500 font-normal">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">5 free image generations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">All social media formats</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">HD downloads</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Generation history</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleGetStarted} 
                  variant="outline"
                  className="w-full py-3 rounded-xl border-2 hover:bg-green-50 hover:border-green-500 transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-intense hover:shadow-primary/25 hover:scale-105 transition-all duration-500 stagger-item">
              {/* Popular badge */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              </div>
              
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">
                  $19<span className="text-lg text-slate-500 font-normal">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-600">200 image generations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Priority generation speed</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Advanced customization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Commercial license</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Email support</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleGetStarted} 
                  className="w-full btn-primary py-3 rounded-xl shadow-lg hover:shadow-primary/25"
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-medium hover:shadow-intense hover:scale-105 transition-all duration-500 stagger-item">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-slate-900 mb-6">
                  Custom<span className="text-lg text-slate-500 font-normal">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Unlimited generations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Custom AI training</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">API access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">Team collaboration</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline"
                  className="w-full py-3 rounded-xl border-2 hover:bg-slate-50 hover:border-slate-500 transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ or additional info */}
          <div className="text-center mt-12 sm:mt-16 fade-in">
            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">All plans include free updates and 24/7 technical support</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>30-day money back</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>No setup fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="md:col-span-2 fade-in">
              <div className="flex items-center space-x-3 mb-6 sm:mb-8 justify-center md:justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl text-gradient-primary">AI Creator Studio</span>
              </div>
              
              <p className="text-slate-300 mb-6 sm:mb-8 max-w-lg text-base sm:text-lg leading-relaxed text-center md:text-left">
                Create stunning, professional social media images with AI. 
                Tailored to your niche, optimized for your platform.
              </p>
              
              <div className="flex space-x-4 justify-center md:justify-start">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  <span className="text-lg">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  <span className="text-lg">📘</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  <span className="text-lg">📷</span>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                  <span className="text-lg">💼</span>
                </div>
              </div>
            </div>

            <div className="slide-in-up text-center md:text-left" style={{animationDelay: '0.2s'}}>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-4 text-slate-300">
                <li><a href="#features" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#examples" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Examples</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">API</a></li>
              </ul>
            </div>

            <div className="slide-in-up text-center md:text-left" style={{animationDelay: '0.4s'}}>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-4 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 fade-in">
            <p className="text-base sm:text-lg">&copy; 2024 AI Creator Studio. All rights reserved. Made with ❤️ for creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
}