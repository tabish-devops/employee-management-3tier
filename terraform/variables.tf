variable "ssh_allowed_cidr" {
  description = "Your public IP in CIDR format for SSH access, for example x.x.x.x/32"
  type        = string

  validation {
    condition     = can(cidrhost(var.ssh_allowed_cidr, 0))
    error_message = "Provide a valid CIDR range, such as your-public-ip/32."
  }
}
