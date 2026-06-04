---
title: "Understanding BGP routing in multi-provider networks"
description: "In this issue, we demystify Border Gateway Protocol (BGP), autonomous systems, path selection, and how multi-homed infrastructures handle failure routing."
date: "2026-05-27"
issueNumber: "02"
author: "theinfra staff"
tags: ["networking", "protocols", "bgp"]
---

Welcome back to **The Stack**. Today, we shift our focus from local kernel settings to the global routing layers that connect autonomous networks across the Internet: the **Border Gateway Protocol (BGP)**.

## Autonomous Systems (AS)

The Internet is not a single database of routing information; it's a federation of independent networks called Autonomous Systems (AS). Every major internet service provider (ISP), university, and tech giant (like Google, Cloudflare, AWS) operates one or more Autonomous Systems. Each AS is identified by a unique number: the **ASN**.

For instance, Cloudflare's primary ASN is `AS13335`.

## Path Selection Mechanics

BGP is a path-vector protocol. Unlike interior gateway routing protocols (like OSPF or IS-IS) which rely on interface speeds or links to calculate the "shortest path", BGP selects routes based on path attributes, policy controls, and prefix lengths.

When a BGP router receives multiple routes to the same destination, it evaluates them using the following step-by-step decision hierarchy:

1. **Highest Weight**: Local attribute specific to the router (proprietary Cisco metric).
2. **Highest Local Preference**: Instructs the AS how to exit the network (favors routes with higher values).
3. **Locally Originated**: Prefer routes created by the router itself.
4. **Shortest AS-Path**: Prefer the route that passes through the fewest Autonomous Systems.
5. **Lowest Origin Type**: IGP routes are preferred over EGP.
6. **Lowest Multi-Exit Discriminator (MED)**: Instructs external neighbors how to enter the network.

```
       [ Client AS ]
          /     \
         /       \
     [ISP A]   [ISP B]
     (MED 50)  (MED 100)
         \       /
          \     /
       [Target ASN]
```

In the diagram above, traffic from the client AS will prefer entering the target network via `ISP A` because of the lower MED value (`50` vs `100`).

## Multi-homing and Failover

Running a single-homed infrastructure (connecting to only one upstream provider) creates a single point of failure. **Multi-homing** involves connecting your network boundary routers to two or more ISPs. 

If one link fails:
- BGP keeps alive timers fail.
- Routers withdraw the bad route advertisement.
- Traffic automatically shifts to the healthy upstream link within seconds.

> [!WARNING]
> While BGP handles failover gracefully, route flap dampening can cause temporary instability if a physical link oscillates (rapidly goes up and down). Modern network engineers configure aggressive interface delay timers to prevent flaps from propagating across global routing tables.

Next week, we'll talk about DNS Anycast routing and how it distributes loads globally.
