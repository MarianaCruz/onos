/*
 * Copyright 2018-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as d3 from 'd3';
import {LocationType} from '../../backgroundsvg/backgroundsvg.component';
import {LayerType, Location, NodeType, RegionProps} from './regions';
import {LocMeta, LogService, MetaUi} from 'gui2-fw-lib';
import {ZoomUtils} from 'gui2-fw-lib';

export interface UiElement {
    index?: number;
    id: string;
}

/**
 * Toggle state for how device labels should be displayed
 */
export enum LabelToggle {
    NONE,
    ID,
    NAME
}

/**
 * Add the method 'next()' to the LabelToggle enum above
 */
export namespace LabelToggle {
    export function next(current: LabelToggle) {
        if (current === LabelToggle.NONE) {
            return LabelToggle.ID;
        } else if (current === LabelToggle.ID) {
            return LabelToggle.NAME;
        } else if (current === LabelToggle.NAME) {
            return LabelToggle.NONE;
        }
    }
}

/**
 * Toggle state for how host labels should be displayed
 */
export enum HostLabelToggle {
    NONE,
    NAME,
    IP,
    MAC
}

/**
 * Add the method 'next()' to the HostLabelToggle enum above
 */
export namespace HostLabelToggle {
    export function next(current: HostLabelToggle) {
        if (current === HostLabelToggle.NONE) {
            return HostLabelToggle.NAME;
        } else if (current === HostLabelToggle.NAME) {
            return HostLabelToggle.IP;
        } else if (current === HostLabelToggle.IP) {
            return HostLabelToggle.MAC;
        } else if (current === HostLabelToggle.MAC) {
            return HostLabelToggle.NONE;
        }
    }
}

/**
 * Toggle state for how the grid should be displayed
 */
export enum GridDisplayToggle {
    GRIDNONE,
    GRID1000,
    GRIDGEO,
    GRIDBOTH
}

/**
 * Add the method 'next()' to the GridDisplayToggle enum above
 */
export namespace GridDisplayToggle {
    export function next(current: GridDisplayToggle) {
        if (current === GridDisplayToggle.GRIDNONE) {
            return GridDisplayToggle.GRID1000;
        } else if (current === GridDisplayToggle.GRID1000) {
            return GridDisplayToggle.GRIDGEO;
        } else if (current === GridDisplayToggle.GRIDGEO) {
            return GridDisplayToggle.GRIDBOTH;
        } else if (current === GridDisplayToggle.GRIDBOTH) {
            return GridDisplayToggle.GRIDNONE;
        }
    }
}

/**
 * model of the topo2CurrentRegion device props from Device below
 */
export interface DeviceProps {
    latitude: number;
    longitude: number;
    name: string;
    locType: LocationType;
    uiType: string;
}

export interface HostProps {
    gridX: number;
    gridY: number;
    latitude: number;
    longitude: number;
    locType: LocationType;
    name: string;
}

/**
 * Implementing SimulationNodeDatum interface into our custom Node class
 */
export abstract class Node implements UiElement, d3.SimulationNodeDatum {
    // Optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;
    x: number;
    y: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    nodeType: NodeType;
    id: string;

    protected constructor(id) {
        this.id = id;
        this.x = 0;
        this.y = 0;
    }
}

/**
 * model of the topo2CurrentRegion device from Region below
 */
export class Device extends Node {
    id: string;
    layer: LayerType;
    location: Location;
    metaUi: MetaUi;
    master: string;
    online: boolean;
    props: DeviceProps;
    type: string;

    constructor(id: string) {
        super(id);
    }
}

/**
 * Model of the ONOS Host element in the topology
 */
export class Host extends Node {
    configured: boolean;
    id: string;
    ips: string[];
    layer: LayerType;
    props: HostProps;

    constructor(id: string) {
        super(id);
    }
}


/**
 * model of the topo2CurrentRegion subregion from Region below
 */
export class SubRegion extends Node {
    id: string;
    location: Location;
    nDevs: number;
    nHosts: number;
    name: string;
    props: RegionProps;

    constructor(id: string) {
        super(id);
    }
}

/**
 * Enumerated values for topology update event types
 */
export enum ModelEventType {
    HOST_ADDED_OR_UPDATED,
    LINK_ADDED_OR_UPDATED,
    DEVICE_ADDED_OR_UPDATED,
    DEVICE_REMOVED,
    HOST_REMOVED
}

/**
 * Enumerated values for topology update event memo field
 */
export enum ModelEventMemo {
    ADDED = 'added',
    REMOVED = 'removed',
    UPDATED = 'updated'
}

