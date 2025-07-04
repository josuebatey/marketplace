'use client'

import { useSearchParams } from 'next/navigation'
import { ListingTypeSelector } from '@/components/ui/listing-type-selector'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { createListing, uploadImage } from '@/lib/supabase'
import { toast } from 'sonner'

export default function CreatePage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    images: [] as string[]
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setPreviewImage(imageUrl)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!type) {
    return <ListingTypeSelector />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!previewImage) {
      toast.error('Please add at least one photo')
      return
    }

    setIsSubmitting(true)
    try {
      await createListing({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        email: '',
        category: formData.category,
        condition: formData.condition,
        location: 'Palo Alto, CA',
        image_url: previewImage,
      })

      toast.success('Listing created successfully!')
      // Reset form
      setFormData({
        title: '',
        price: '',
        category: '',
        condition: '',
        description: '',
        images: []
      })
      setPreviewImage(null)
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create new listing</h1>
        <p className="text-gray-600">Fill out the details below to list your item for sale</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Photos Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
              <p className="text-sm text-gray-600 mb-4">Add photos to show what you're selling</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Main Upload Button */}
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-500 text-lg">+</span>
                    </div>
                    <span className="text-sm text-gray-500">Add photo</span>
                  </div>
                </label>

                {/* Preview Images */}
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={image}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, images: newImages }))
                        if (index === 0) setPreviewImage(newImages[0] || null)
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What are you selling?"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <option value="">Select a category</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="home-goods">Home Goods</option>
                      <option value="sports">Sports & Recreation</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition" className="text-sm font-medium text-gray-700">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                    >
                      <option value="">Select condition</option>
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you're selling. Include details like size, color, brand, and any flaws."
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish listing'}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <p className="text-sm text-gray-600 mb-6">This is how your listing will appear to others</p>
              
              {/* Preview Card */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-gray-400 text-xl">📷</span>
                        </div>
                        <p>No photo added</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    {formData.price ? `$${formData.price}` : '$0'}
                  </p>
                  <h3 className="text-sm text-gray-800 font-medium mb-2">
                    {formData.title || 'Item title'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Palo Alto, CA • Listed just now
                  </p>
                  {formData.condition && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {formData.condition}
                    </span>
                  )}
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 