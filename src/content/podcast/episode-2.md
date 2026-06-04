---
title: "Kernel-level Packet Filtering with eBPF and XDP"
description: "In this episode, we host kernel developer Zara Ndiaye to explain eBPF bytecode compilation, XDP hook placements, and packet drops at the network driver interface."
date: "2026-05-28"
episodeNumber: "02"
duration: "56:32"
audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
tags: ["linux", "ebpf", "kernel", "security"]
---

Today on **Runtime**, we dive deep into the Linux kernel with Zara Ndiaye, a security engineer who works on high-volume DDoS mitigation systems. We talk about how **eBPF (Extended Berkeley Packet Filter)** and **XDP (eXpress Data Path)** are changing how modern systems filter packets before they ever reach the network stack.

## Topics Covered

1. **The Linux Network Stack Bottleneck**: Why traditional `iptables` or `nftables` configurations degrade CPU performance at 10Gbps+ traffic speeds due to context switching and memory allocation overhead.
2. **What is eBPF?**: An in-kernel virtual machine that executes sandboxed bytecode at designated hook points within the kernel, ensuring safe execution without recompiling kernel modules.
3. **XDP Driver Hook**: Placing packet filters directly inside the network device driver (the earliest possible software hook), allowing packet drops (`XDP_DROP`) before the kernel constructs a Socket Buffer (`sk_buff`).
4. **eBPF Maps**: The shared key-value stores used to pass routing metrics, IP blacklists, and telemetry stats between kernel space and user-space dashboard systems.

## Key Quotes

> **Zara**: "XDP allows us to drop millions of malicious packets per second on a single machine without sweating. When a packet is dropped at the driver layer, the OS spends close to zero CPU cycles processing it. It's the ultimate firewall architecture."

## Useful Resources

- [eBPF Core Website & Documentation](https://ebpf.io)
- [Cilium eBPF & XDP Introduction Guide](https://github.com/cilium/ebpf)
- [BPF compiler collection (BCC) Tools](https://github.com/iovisor/bcc)
