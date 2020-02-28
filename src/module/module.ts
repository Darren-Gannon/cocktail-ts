import { Service } from "../service/service.interface";

export class Module implements Service {
    public services: {[service_name: string]: Service } = {};
    public imports: {[service_name: string]: Module } = {};
    private _services: {[service_name: string]: Service } = {};
    public _imports: {[service_name: string]: Module } = {};
    
    constructor(protected config: Partial<ModuleConfig>) {
        for(let provider_name in this.config.providers) {
            let provider_function = this.config.providers[provider_name];
            this.provide(provider_name, provider_function)
        }
        for(let import_name in this.config.imports) {
            this.import(import_name, this.config.imports[import_name])
        }
    }

    async onInit(): Promise<any> {
        let importedModules: Module[] = Object.keys(this.imports).map(key => this.imports[key]);

        await Promise.all(importedModules.map(mod => mod.onInit()));

        let myServices: Service[] = Object.keys(this.services).map(key => this.services[key]);

        await Promise.all(myServices.map(service => service.onInit()));
    }

    async onDestroy(): Promise<any> {
        let myServices: Service[] = Object.keys(this.services).map(key => this.services[key]);

        await Promise.all(myServices.map(service => service.onDestroy()));

        let importedModules: Module[] = Object.keys(this.imports).map(key => this.imports[key]);

        await Promise.all(importedModules.map(mod => mod.onDestroy()));
    }

    import(import_name: string, import_module: Module) {    
        Object.defineProperty(this.imports, import_name, {
            enumerable: true,
            configurable: false,
            get: () => {
                if(this.config.imports[import_name] == undefined){
                    throw new Error(`'${import_name}' not imported`)
                }
                return this.config.imports[import_name];
            }
        })
    }

    provide(provider_name: string, provider: NewableServiceFunction ) {
        Object.defineProperty(this.services, provider_name, {
            enumerable: true,
            configurable: false,
            get: () => {
                if(this._services[provider_name] == undefined){
                    this._services[provider_name] = provider(this);
                }
                return this._services[provider_name];
            }
        })
    }
}

export interface ModuleConfig {
    imports: {[name: string]: Module},
    providers: {[name: string]: NewableServiceFunction}
}

export type NewableServiceFunction = (module: Module) => Service;