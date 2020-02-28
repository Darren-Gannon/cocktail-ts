export interface Service {
    onInit(): Promise<any>
    onDestroy(): Promise<any>
}