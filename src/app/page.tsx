'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/search-bar'
import { ListingCard } from '@/components/ui/listing-card'
import { getListings, type Listing } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, ChevronRight } from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings()
        setListings(data)
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || listing.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { name: 'All', icon: '🏪' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Property Rentals', icon: '🏠' },
    { name: 'Apparel', icon: '👕' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Entertainment', icon: '🎮' },
    { name: 'Family', icon: '👶' },
    { name: 'Garden & Outdoor', icon: '🌱' },
    { name: 'Hobbies', icon: '🎨' },
    { name: 'Home Goods', icon: '🏡' },
    { name: 'Musical Instruments', icon: '🎸' },
    { name: 'Sports', icon: '⚽' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="space-y-6">
          {/* Location Section */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Palo Alto, CA · Within 2mi</span>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-semibold text-lg mb-4 text-gray-900">Browse all</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 ${
                    activeCategory === category.name 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1 text-left">{category.name}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Filters</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Price
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Location
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Condition
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Categories */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.name 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar - Mobile Only */}
            <div className="lg:hidden mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search marketplace"
              />
            </div>

            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Today&apos;s picks</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Palo Alto · Within 2mi</span>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredListings.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or browse different categories</p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
