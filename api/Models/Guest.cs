using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Guest
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Contact { get; set; }

        [Required]
        public string Token { get; set; } = Guid.NewGuid().ToString("N")[..10]; // Short 10-char token

        public GuestStatus Status { get; set; } = GuestStatus.Pending;

        public string? Message { get; set; }
    }

    public enum GuestStatus
    {
        Pending,
        Confirmed,
        Declined
    }
}
