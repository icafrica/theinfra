---
title: "Tuning Linux TCP stack for high concurrency"
description: "In this issue, we explore sysctl tweaks, TCP window sizes, socket backlogs, and memory limits for high throughput web servers."
date: "2026-05-20"
issueNumber: "01"
author: "theinfra staff"
tags: ["linux", "networking", "performance"]
---

Welcome to the inaugural issue of **The Stack**. In this edition, we dive straight into tuning the Linux kernel TCP/IP stack to support hundreds of thousands of concurrent connections. By default, Linux is configured for general-purpose workloads, which can bottle-neck high-traffic reverse proxies or api gateways.

## The Ephemeral Port Limit

When a client makes a connection, it uses a local source port from the ephemeral port range. By default, this is limited to about 28,000 ports. Under high load, you can run out of ports, leading to `bind: address already in use` errors.

To check your current range:
```bash
sysctl net.ipv4.ip_local_port_range
```

To expand the range to allow up to 50,000 ports, edit `/etc/sysctl.conf`:
```ini
net.ipv4.ip_local_port_range = 15000 65000
```

## TCP backlog Queues

When a connection request comes in, it passes through the backlog queue before being accepted by the application. There are two backlog queues of importance:

1. **SYN backlog** (`net.ipv4.tcp_max_syn_backlog`): Holds connections that have received a SYN packet but haven't completed the 3-way handshake.
2. **Listen backlog** (`net.core.somaxconn`): Holds connections that have completed the handshake and are waiting for the application to call `accept()`.

```ini
# Increase SYN backlog queue size
net.ipv4.tcp_max_syn_backlog = 16384

# Increase max listen queue backlog
net.core.somaxconn = 16384
```

> [!IMPORTANT]
> Ensure your application listener (e.g., NGINX `backlog` parameter, or Node's `backlog` argument) is also configured to match or exceed the system `somaxconn` value. Otherwise, the application will truncate the queue to its default limit.

## Memory Tuning for Sockets

Sockets consume RAM. If you have 100k open connections, they can occupy a significant chunk of kernel memory. Tune the TCP memory buffers:

```ini
# Read/Write buffer default and max limits
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216

# TCP-specific memory allocations (min, pressure, max in pages)
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
```

In the next issue, we will investigate how to trace dropped packets using `dropwatch` and `bpftrace`. Stay tuned!
