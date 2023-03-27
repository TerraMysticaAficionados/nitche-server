declare module "browserify-middleware" {
    import type Express from "express"
    type Arraified<T> = T[]|boolean
    type BrowserifyMiddlewareSettings = Partial<{
        external: Arraified<unknown>
        ignore: Arraified<unknown>
        ignoreMissing: boolean
        transform: Arraified<unknown>
        insertGlobals: boolean
        detectGlobals: boolean
        standalone: boolean
        noParse: Arraified<unknown>
        extensions: Arraified<unknown>
        basedir: string
        grep: RegExp
        cache: string|boolean|object
        minify: boolean
        gzip: boolean
        debug: boolean
        precompile: boolean
    }>
    
    function browserify(path: string, options?:BrowserifyMiddlewareSettings): Express.NextFunction
    export function directory(path: string, options?:BrowserifyMiddlewareSettings): Express.NextFunction
    export function file(path: string, options?:BrowserifyMiddlewareSettings): Express.NextFunction
    export function modules(path: string, options?:BrowserifyMiddlewareSettings): Express.NextFunction
    export const settings: BrowserifyMiddlewareSettings
    export default browserify
}