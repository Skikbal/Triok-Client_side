import React from 'react'

const leads = [
    { label: "Met", value: "met" },
    { label: "Haven't Met", value: "haven't_met" },
    { label: "Met or Haven't Met", value: "met_or_have_not_met" },
    { label: "Not a Met or Haven't Met", value: "not_a_met_or_havenpt_met" },]



const PropertyOptionalTags = ({ handletags, tags }) => {



    return (
        <div>

            <div className="mt-6">
                {leads.flatMap((el, i) => (
                    <label key={i} className="container">
                        <input type="checkbox"
                            value={el.value}
                            onChange={handletags}
                            checked={tags.includes(el.value)}
                        />
                        <span className="checkmark"></span>
                        <p className="dark-M body-N">{el.label}</p>
                    </label>
                ))}
            </div>
            {/* <p role="button" className="dark-M body-N">
                Show More
            </p> */}
        </div>
    )
}

export default PropertyOptionalTags
