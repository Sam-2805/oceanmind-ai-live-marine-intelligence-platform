import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    role: string;
    organization?: string;
}
export interface IoTAnalysis {
    id: string;
    region: string;
    owner: Principal;
    dataType: string;
    timestamp: Time;
    dataModule: string;
    alertStatus: boolean;
    riskScore: number;
}
export type Time = bigint;
export interface Stakeholder {
    contactInfo: string;
    name: string;
    type: string;
}
export interface CoralAnalysis {
    region: string;
    thermalStress: number;
    owner: Principal;
    dataType: string;
    timestamp: Time;
    alertStatus: boolean;
    imageId?: string;
    riskScore: number;
    bleachingProbability: number;
}
export interface FusionCorrelations {
    satelliteCoral: number;
    iotAIS: number;
    parameters: string;
    satelliteAIS: number;
    mapAIS: number;
    mapIot: number;
    iotSatellite: number;
    iotCoral: number;
    mapCoral: number;
    coralAIS: number;
}
export interface RiskAssessment {
    severityLevel: string;
    riskType: string;
    confidenceScore: number;
    overallRisk: string;
}
export interface SatelliteAnalysis {
    id: string;
    region: string;
    clusterFlag: boolean;
    sourceSentinel1: boolean;
    sourceSentinel2: boolean;
    vesselCount: bigint;
    owner: Principal;
    sourceModis: boolean;
    sourceLandsat: boolean;
    nearCoral: boolean;
    marina_area_flag: boolean;
    timestamp: Time;
    pollutionFlag: boolean;
    riskScore: number;
}
export interface MapData {
    currOverlays: Array<OceanParameter>;
    vessels: Array<VesselData>;
    pollutionOverlays: Array<OceanParameter>;
    tempOverlays: Array<OceanParameter>;
}
export interface VesselData {
    id: string;
    mmsi: string;
    name: string;
    type: string;
    lastUpdated: Time;
    heading: number;
    speed: number;
    motionDirection: number;
    riskLevel: string;
    riskScore: number;
    coordinates: Coordinate;
}
export interface Coordinate {
    lat: number;
    lng: number;
}
export interface AISAnalysis {
    id: string;
    region: string;
    owner: Principal;
    timestamp: Time;
    dataModule: string;
    alertStatus: boolean;
    vesselIDs: Array<string>;
    riskScore: number;
}
export interface AIRecommendations {
    id: string;
    snapshotId: string;
    situationSummary: string;
    owner: Principal;
    confidenceLevels: Array<ConfidenceLevel>;
    responsibleStakeholders: Array<Stakeholder>;
    timestamp: Time;
    actionableSteps: Array<ActionStep>;
    riskAssessment: RiskAssessment;
}
export interface ConfidenceLevel {
    value: number;
    indicator: string;
    category: string;
}
export interface ActionStep {
    action: string;
    description: string;
    priority: string;
}
export interface FusionAnalysisRecord {
    id: string;
    owner: Principal;
    alertsGenerated: bigint;
    timestamp: Time;
    fusionRiskScore: number;
    correlations: FusionCorrelations;
    aiRecommendations?: AIRecommendations;
    globalRiskScore: number;
}
export interface Alert {
    id: string;
    source?: string;
    owner: Principal;
    type: string;
    timestamp: Time;
    severity: bigint;
}
export interface OceanParameter {
    curr: {
        direction: number;
        speed: number;
    };
    temp: number;
    pollution: number;
    location: Coordinate;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAIRecommendations(id: string): Promise<AIRecommendations | null>;
    getAISAnalysisHistory(): Promise<Array<AISAnalysis>>;
    getAlertsBySeverity(severity: bigint): Promise<Array<Alert>>;
    getAlertsByType(alertType: string): Promise<Array<Alert>>;
    getAllAlerts(): Promise<Array<Alert>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoralAnalysisHistory(): Promise<Array<CoralAnalysis>>;
    getFusionAnalysisHistory(): Promise<Array<FusionAnalysisRecord>>;
    getIoTAnalysisHistory(): Promise<Array<IoTAnalysis>>;
    getMapData(): Promise<MapData>;
    getSatelliteAnalysisHistory(): Promise<Array<SatelliteAnalysis>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAISAnalysis(id: string, dataModule: string, region: string, vesselIDs: Array<string>, riskScore: number): Promise<boolean>;
    saveAlert(id: string, type: string, severity: bigint, source: string | null): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCoralAnalysis(region: string, imageId: string | null, bleachingProbability: number, thermalStress: number, riskScore: number, dataType: string): Promise<boolean>;
    saveFusionAnalysis(id: string, correlations: FusionCorrelations, fusionRiskScore: number, globalRiskScore: number, alertsGenerated: bigint, aiRecommendations: AIRecommendations): Promise<boolean>;
    saveIoTAnalysis(id: string, dataModule: string, region: string, dataType: string, riskScore: number): Promise<boolean>;
    saveSatelliteAnalysis(id: string, region: string, sourceSentinel1: boolean, sourceSentinel2: boolean, sourceLandsat: boolean, sourceModis: boolean, vesselCount: bigint, clusterFlag: boolean, pollutionFlag: boolean, nearCoral: boolean, marina_area_flag: boolean, riskScore: number): Promise<boolean>;
    updateAlert(id: string, type: string, severity: bigint, source: string | null): Promise<boolean>;
}
