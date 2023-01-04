import React from 'react';

export default function Organization({ organization, errors }) {
    if(errors) {
        return (
            <p>
                <strong>Something went wrong</strong>
                {
                    errors.map(error => error.message).join(' ')
                }
            </p>
        )
    }
        
    return (
        <div>
            <p>
                <strong>Issues from Organization:</strong>
                <a href={organization.url}>{organization.name}</a>
            </p>
        </div>
    )
}