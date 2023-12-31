import { useState, useEffect } from 'react'

import { emailService } from '../services/email.service.js'
import { utilService } from '../services/util.service.js'

import { EmailFolder } from "./EmailFolder"


export function EmailFolderMenu({ currFolder, currLabel, isFolderMenuOpen, cbFilterEmails, cbOpenComposedEmail }) {
    const [folders, setFolders] = useState([])
    const [labelFolders, setLabelFolders] = useState([])

    useEffect(() => {
        getFolders()
        getLabelFolders()
    }, [])

    async function getFolders() {
        const updatedFolders = await emailService.getFolders()
        setFolders(updatedFolders)
    }

    async function getLabelFolders() {
        const updatedLabels = await emailService.getLabelFolders()
        setLabelFolders(updatedLabels)
    }

    function changeFolder(folderName, isLabel = false) {
        if (isLabel) {
            cbFilterEmails({ folder: "label", label: folderName })
        } else {
            cbFilterEmails({ folder: folderName, label: '' })
        }
    }


    // TODO - Warning - The label name might be equal to a folder name.
    return (
        <section className={"email-menu" + (isFolderMenuOpen ? " menu-open" : " menu-close")}>

            <div className="email-menu-compose-wrapper">
                <div className="email-menu-compose" onClick={(ev) => cbOpenComposedEmail()}>
                    <i className="icon-mail-compose"></i>
                    <span className="mail-compose">Compose</span>
                </div>
            </div>

            <div className="email-menu-scrollable scrollable-thin">
                <div className="email-menu-folders">
                    {
                        folders.map((folder, idx) =>
                            <EmailFolder key={idx + folder.name}
                                folderText={folder.text}
                                isCurrFolder={folder.name === currFolder ? true : false}
                                iconClassName={folder.iconClass}
                                cbChangeFolder={() => changeFolder(folder.name)} />
                        )
                    }
                </div>
                <div className="email-menu-labels">
                    <h2>Labels </h2>
                    {
                        labelFolders.sort().map((label, idx) =>
                            <EmailFolder key={idx + label}
                                folderText={label}
                                isCurrFolder={currFolder === "label" && currLabel === label ? true : false}
                                iconClassName="icon-folder-label"
                                cbChangeFolder={() => changeFolder(label, true)} />
                        )
                    }
                </div>
            </div>

        </section>
    )
}
