import React from 'react'
import twitterLogo from '../assets/twitter-logo.svg';
import openseaLogo from '../assets/opensea-logo.svg'

// Constants
const TWITTER_HANDLE = '_Therth';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_COLLECTION_LINK = 'https://testnets.opensea.io/collection/randomstringsaf';

const ItemLink = ({ item }) => (
    <div className='footer-item'>
        <img alt={`${item.name} Logo`} className={item.styleClass} src={item.logo_link} />
        <a
            className="footer-text"
            href={item.site_link}
            target="_blank"
            rel="noreferrer"
        >{item.text}</a>
    </div>
)

const Footer = () => {

    const dataLinks = [
        {
            name: 'Twitter',
            text: `Built by @${TWITTER_HANDLE}`,
            site_link: TWITTER_LINK,
            logo_link: twitterLogo,
            styleClass: 'logo-twitter'
        },
        {
            name: 'Opensea',
            text: 'Visit Collection',
            site_link: OPENSEA_COLLECTION_LINK,
            logo_link: openseaLogo,
            styleClass: 'logo-opensea'
        }
    ]

    return (
        <div className="footer-container">
            {dataLinks.map((item, index) => (
                <ItemLink key={index} item={item} />
            ))}
        </div>
    )
}

export default Footer
