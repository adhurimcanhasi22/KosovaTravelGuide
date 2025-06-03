export default function TravelTip({ tip }) {
  return (
    <div className="card p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 text-kosovo-blue">
          <i className={`fas fa-${tip.icon} text-3xl`}></i>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
          <p className="text-gray-600">{tip.content}</p>
          
          {tip.list && tip.list.length > 0 && (
            <ul className="mt-3 space-y-1 list-disc pl-5">
              {tip.list.map((item, index) => (
                <li key={index} className="text-gray-600">{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
