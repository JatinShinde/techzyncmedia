package com.techzyncmedia.backend.dto;

public class DashboardStatsDto {
    private long totalLeads;
    private long newLeads;
    private long contactedLeads;
    private long qualifiedLeads;
    private long convertedLeads;
    private long totalMessages;
    private long unreadMessages;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalLeads, long newLeads, long contactedLeads, long qualifiedLeads, long convertedLeads, long totalMessages, long unreadMessages) {
        this.totalLeads = totalLeads;
        this.newLeads = newLeads;
        this.contactedLeads = contactedLeads;
        this.qualifiedLeads = qualifiedLeads;
        this.convertedLeads = convertedLeads;
        this.totalMessages = totalMessages;
        this.unreadMessages = unreadMessages;
    }

    public long getTotalLeads() { return totalLeads; }
    public void setTotalLeads(long totalLeads) { this.totalLeads = totalLeads; }

    public long getNewLeads() { return newLeads; }
    public void setNewLeads(long newLeads) { this.newLeads = newLeads; }

    public long getContactedLeads() { return contactedLeads; }
    public void setContactedLeads(long contactedLeads) { this.contactedLeads = contactedLeads; }

    public long getQualifiedLeads() { return qualifiedLeads; }
    public void setQualifiedLeads(long qualifiedLeads) { this.qualifiedLeads = qualifiedLeads; }

    public long getConvertedLeads() { return convertedLeads; }
    public void setConvertedLeads(long convertedLeads) { this.convertedLeads = convertedLeads; }

    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }

    public long getUnreadMessages() { return unreadMessages; }
    public void setUnreadMessages(long unreadMessages) { this.unreadMessages = unreadMessages; }

    public static DashboardStatsDtoBuilder builder() { return new DashboardStatsDtoBuilder(); }

    public static class DashboardStatsDtoBuilder {
        private long totalLeads;
        private long newLeads;
        private long contactedLeads;
        private long qualifiedLeads;
        private long convertedLeads;
        private long totalMessages;
        private long unreadMessages;

        public DashboardStatsDtoBuilder totalLeads(long totalLeads) { this.totalLeads = totalLeads; return this; }
        public DashboardStatsDtoBuilder newLeads(long newLeads) { this.newLeads = newLeads; return this; }
        public DashboardStatsDtoBuilder contactedLeads(long contactedLeads) { this.contactedLeads = contactedLeads; return this; }
        public DashboardStatsDtoBuilder qualifiedLeads(long qualifiedLeads) { this.qualifiedLeads = qualifiedLeads; return this; }
        public DashboardStatsDtoBuilder convertedLeads(long convertedLeads) { this.convertedLeads = convertedLeads; return this; }
        public DashboardStatsDtoBuilder totalMessages(long totalMessages) { this.totalMessages = totalMessages; return this; }
        public DashboardStatsDtoBuilder unreadMessages(long unreadMessages) { this.unreadMessages = unreadMessages; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalLeads, newLeads, contactedLeads, qualifiedLeads, convertedLeads, totalMessages, unreadMessages);
        }
    }
}
