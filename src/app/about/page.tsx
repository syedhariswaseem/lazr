import { Award, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Lazr
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Leading the industry with innovation, precision, and unwavering commitment to quality.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2010, Lazr has been at the forefront of laser cutting
                technology, serving industries worldwide with cutting-edge solutions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our journey began with a simple mission: to make precision laser cutting
                technology accessible to manufacturers of all sizes. Today, we're proud
                to be a trusted partner for thousands of businesses across the globe.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                With over a decade of experience and continuous innovation, we've
                established ourselves as the go-to provider for industrial laser
                cutting machinery that delivers exceptional results.
              </p>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 flex items-center justify-center shadow-xl">
              <span className="text-gray-500 dark:text-gray-300 text-lg">Company Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Precision</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We deliver laser cutting solutions with unmatched precision that exceeds industry standards.
              </p>
            </div>

            <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our commitment to quality is unwavering. Every product we manufacture
                meets the highest standards of excellence.
              </p>
            </div>

            <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We continuously push the boundaries of laser cutting technology,
                developing solutions for tomorrow's challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Machines Installed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">13</div>
              <div className="text-gray-600 dark:text-gray-400">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet the experts behind our innovative laser cutting solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{name:'Sarah Johnson', role:'CEO & Founder'},{name:'Michael Chen', role:'CTO'},{name:'Emily Rodriguez', role:'Head of Operations'}].map((member) => (
              <div key={member.name} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-600 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Expert leader driving innovation and excellence in laser technology.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 