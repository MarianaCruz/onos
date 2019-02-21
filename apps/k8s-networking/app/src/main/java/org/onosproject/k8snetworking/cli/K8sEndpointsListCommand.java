/*
 * Copyright 2019-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.onosproject.k8snetworking.cli;

import com.google.common.collect.Lists;
import io.fabric8.kubernetes.api.model.Endpoints;
import org.apache.karaf.shell.commands.Command;
import org.onosproject.cli.AbstractShellCommand;
import org.onosproject.k8snetworking.api.K8sEndpointsService;

import java.util.Comparator;
import java.util.List;

/**
 * Lists kubernetes endpoints.
 */
@Command(scope = "onos", name = "k8s-endpoints",
        description = "Lists all kubernetes endpoints")
public class K8sEndpointsListCommand extends AbstractShellCommand {

    private static final String FORMAT = "%-50s%-50s%-20s";

    @Override
    protected void execute() {
        K8sEndpointsService service = get(K8sEndpointsService.class);
        List<Endpoints> endpointses = Lists.newArrayList(service.endpointses());
        endpointses.sort(Comparator.comparing(e -> e.getMetadata().getName()));

        print(FORMAT, "Name", "IP Addresses", "Ports");

        for (Endpoints endpoints : endpointses) {

            List<String> ips = Lists.newArrayList();
            List<Integer> ports = Lists.newArrayList();

            endpoints.getSubsets().forEach(e -> {
                e.getAddresses().forEach(a -> ips.add(a.getIp()));
                e.getPorts().forEach(p -> ports.add(p.getPort()));
            });

            print(FORMAT,
                    endpoints.getMetadata().getName(),
                    ips.isEmpty() ? "" : ips,
                    ports.isEmpty() ? "" : ports);
        }
    }
}