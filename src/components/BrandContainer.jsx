import Brands from './Brands'
import brands from '../info/brands.js'

const brandsPrev = brands.map((brand, index) => {
    return <Brands
            key={index}
            {...brand}
        />
})

export default function BrandContainer(){
    return (
        <section className="brands">
            <h1>Partnerships</h1>
            <div>
                {brandsPrev}
            </div>
            
        </section>
    )
}