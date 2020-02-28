# cocktail-ts

`cocktail-ts` is an IOC container that will clean up index files.

## Usage

### Define the `AppModule`

``` 
import { Module, Service } from 'cocktail-ts';

let AppModule: Module = new Module({ });
```

### Start the AppModule

```
AppModule.onInit() // Promise
```

### Stop the AppModule

```
AppModule.onDestroy() // Promise
```

### Define a `Service`

```
class MyService implements Service {

    constructor( ) {}

    async onInit(): Promise<void> { }
    
    async onDestroy(): Promise<void> { }
}
```

### Add the service to a `Module`

```
let AppModule: Module = new Module({
    providers: {
        MyService: m => new MyService()
    }
});
```

In the providers object, the key is the service alias and the value is a factory function that return a new service instance

```
Provider(module: Module): Service
```
> Provider Function

module: `this`(The module being defined) as if started.

## Import other modules

```
let OtherModule = new Module({ })
```

```
let AppModule: Module = new Module({
    imports: {
        OtherModule
    }
});
```


### Use imported Services

```
class MyService implements Service {

    constructor(
        private OtherService: OtherService
    ) {}

    async onInit(): Promise<void> { }
    
    async onDestroy(): Promise<void> { }

    sayHello(){
        return `hello ${this.testService.getName()}`
    }
}
```

```
let OtherModule = new Module({
    providers: {
        OtherService: m => new OtherService(),
    }
})
```

```
let AppModule: Module = new Module({
    providers: {
        MyService: m => new MyService(m.imports.OtherModule.services.OtherService as OtherService)
    },
    imports: {
        OtherModule
    }
});
```

```
class OtherService implements Service {
    
    async onInit(): Promise<void> { }
    
    async onDestroy(): Promise<void> { }

    getName(): string {
        return 'world';
    }
}
```