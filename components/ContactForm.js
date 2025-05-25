import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // This is a placeholder for future API integration
      // When backend is ready, this will be connected to an actual API endpoint
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Form validation
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill all required fields')
      }
      
      // Success
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.'
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitStatus && (
        <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Your Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-kosovo-blue focus:border-kosovo-blue"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Your Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-kosovo-blue focus:border-kosovo-blue"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-1">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-kosovo-blue focus:border-kosovo-blue"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Your Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-kosovo-blue focus:border-kosovo-blue"
        ></textarea>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Sending...
            </>
          ) : (
            <>Send Message</>
          )}
        </button>
      </div>
    </form>
  )
}
