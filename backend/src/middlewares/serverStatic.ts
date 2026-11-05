import express from 'express'

export default function serveStatic(baseDir: string) {
    return express.static(baseDir, {
        dotfiles: 'deny',
        maxAge: '1h',
        index: false,
    })
}
