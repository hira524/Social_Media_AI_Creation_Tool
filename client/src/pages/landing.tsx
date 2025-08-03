import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Smartphone, Zap, Palette, History, Download, ArrowRight, Check, Play } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">AI Creator Studio</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#examples" className="text-slate-600 hover:text-primary transition-colors">Examples</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-indigo-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Create Stunning{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI-Generated
                </span>{" "}
                Social Media Posts
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed">
                Generate professional social media images tailored to your niche with our intelligent AI. 
                Perfect for Instagram, LinkedIn, and Twitter posts.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
                  Start Creating Free
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  5 free generations
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {examples.slice(0, 4).map((example, index) => (
                    <Card 
                      key={index} 
                      className={`transform transition-transform hover:scale-105 ${
                        index % 2 === 0 ? 'rotate-2' : '-rotate-2'
                      } hover:rotate-0`}
                    >
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-600">{example.category} • {example.platform}</div>
                        <div className="text-sm font-semibold text-slate-900 mt-1">{example.title}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  AI Generated
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything you need to create{" "}
              <span className="text-primary">amazing content</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI understands your niche, style, and audience to generate perfectly tailored social media images
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section id="examples" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
              See what our AI can create for{" "}
              <span className="text-primary">your niche</span>
            </h2>
            <p className="text-xl text-slate-600">Real examples generated by our AI for different industries and styles</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-slate-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${example.color}`}>
                      {example.category}
                    </span>
                    <span className="text-slate-400 text-sm">{example.platform}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{example.title}</h3>
                  <p className="text-sm text-slate-600">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
              Start Creating Your Images
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl">AI Creator Studio</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Create stunning, professional social media images with AI. 
                Tailored to your niche, optimized for your platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#examples" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Creator Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
