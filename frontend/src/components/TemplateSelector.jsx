import { FaIdCard, FaPalette, FaMinus, FaCrown } from 'react-icons/fa'

const TemplateSelector = ({ value = 'template1', onChange }) => {
  const templates = [
    {
      id: 'template1',
      name: 'Classic',
      icon: FaIdCard,
      description: 'Traditional business card layout',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
    {
      id: 'template2',
      name: 'Modern',
      icon: FaPalette,
      description: 'Contemporary design with bold colors',
      preview: 'bg-gradient-to-br from-blue-50 to-purple-50',
    },
    {
      id: 'template3',
      name: 'Minimal',
      icon: FaMinus,
      description: 'Clean and simple design',
      preview: 'bg-gradient-to-br from-white to-gray-50',
    },
    {
      id: 'template4',
      name: 'Elegant',
      icon: FaCrown,
      description: 'Sophisticated and premium look',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-50',
    },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Template
      </label>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => {
          const Icon = template.icon
          const isSelected = value === template.id
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`p-4 rounded-lg border-2 transition ${
                isSelected
                  ? 'border-[#41287b] bg-[#41287b]/10'
                  : 'border-gray-200 hover:border-[#41287b]/50'
              }`}
            >
              <div className={`${template.preview} rounded-md p-4 mb-3`}>
                <Icon className="mx-auto text-[#41287b]" size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
              <p className="text-xs text-gray-600">{template.description}</p>
              {isSelected && (
                <div className="mt-2 text-[#41287b] text-xs font-medium">✓ Selected</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TemplateSelector

